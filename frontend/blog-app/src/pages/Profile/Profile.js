import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../services/profile";
import {
  fetchPublicBlogPosts,
  fetchPrivateBlogPosts,
} from "../../services/blogs";
import BlogPost from "../Blog/BlogPost";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  Button,
  Grid,
  Snackbar,
} from "@mui/material";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, accessToken } = useSelector(
    (state) => state.auth,
  );
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await fetchUserProfile(username);
        setProfile(profileData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated && user.username === username) {
          const privatePosts = await fetchPrivateBlogPosts(
            user.id,
            accessToken,
          );
          setBlogs(privatePosts);
        } else {
          const publicPosts = await fetchPublicBlogPosts(username);
          setBlogs(publicPosts);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError("Failed to fetch blog posts");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, isAuthenticated, accessToken, user, profile]);

  const handleSnackbarClose = () => {
    setError(null); // Clear error state when Snackbar closes
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          padding: "20px",
          flex: 1,
        }}
      >
        <Paper elevation={3} sx={{ p: 2 }}>
          {profile && (
            <Box display="flex" alignItems="center">
              <Avatar
                alt="Profile Picture"
                src={profile.image}
                sx={{ width: 120, height: 120, mr: 2 }}
              />
              <Box>
                <Typography variant="h5" gutterBottom>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  color="text.secondary"
                >
                  @{profile.username}
                </Typography>
                <Typography variant="body1">{profile.bio}</Typography>
                {isAuthenticated && user.username === username && (
                  <Button
                    onClick={() =>
                      navigate(`/profile/${profile.username}/edit`, {
                        state: { profile, isAuthenticated },
                      })
                    }
                    variant="contained"
                    color="primary"
                    sx={{
                      textTransform: "none",
                      marginLeft: "auto",
                      marginTop: "10px",
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Paper>
        <Grid container direction="column" spacing={3} sx={{ mt: 1 }}>
          {blogs.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
              <BlogPost
                post={post}
                likesCount={post.likes_count}
                commentsCount={post.comments_count}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={`Error: ${error}`}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default Profile;
