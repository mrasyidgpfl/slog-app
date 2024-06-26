import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../services/profile";
import { fetchBlogPosts } from "../../services/blogs";
import BlogPost from "../Blog/BlogPost";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  Button,
  Grid,
} from "@mui/material";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
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
      const data = await fetchBlogPosts();
      setBlogs(data);
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              {isAuthenticated && user.username === profile.username && (
                <Button
                  onClick={() =>
                    navigate(`/profile/${profile.username}/edit`, {
                      state: { profile, isAuthenticated }, // Pass profile and isAuthenticated as state
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
        </Paper>
        <Grid container direction="column" spacing={3} sx={{ mt: 1 }}>
          {blogs.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
              <BlogPost
                post={post}
                likesCount={post.likes_count} // Pass likes_count as prop
                commentsCount={post.comments_count} // Pass comments_count as prop
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;
