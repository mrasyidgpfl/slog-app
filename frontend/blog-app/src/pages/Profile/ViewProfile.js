import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  Button,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { fetchBlogPosts } from "../../services/blogs";
import BlogPost from "../Blog/BlogPost";

const ViewProfile = ({ profile, isAuthenticated }) => {
  if (!profile) {
    return <div>Loading profile...</div>;
  }

  const { username, firstName, lastName, bio, image } = profile;

  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBlogPosts();
      setBlogs(data);
    };
    fetchData();
  }, []);

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
              src={image}
              sx={{ width: 120, height: 120, mr: 2 }}
            />
            <Box>
              <Typography variant="h5" gutterBottom>
                {firstName} {lastName}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                color="text.secondary"
              >
                @{username}
              </Typography>
              <Typography variant="body1">{bio}</Typography>
              {isAuthenticated && (
                <Button
                  component={Link}
                  to="/profile/edit"
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

ViewProfile.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default ViewProfile;
