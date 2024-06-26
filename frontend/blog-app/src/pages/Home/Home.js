import React, { useEffect, useState } from "react";
import { Grid, Box, Container, Snackbar } from "@mui/material";
import BlogPost from "../Blog/BlogPost";
import { fetchBlogPosts } from "../../services/blogs";
import { useSelector, useDispatch } from "react-redux";
import { refreshAccessTokenAction } from "../../redux/actions/authActions";
import { isTokenExpired } from "../../utils/authUtils";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { accessToken, refreshToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBlogPosts(accessToken);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError("Failed to fetch blog posts");
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (isTokenExpired(accessToken)) {
        try {
          await dispatch(refreshAccessTokenAction(refreshToken));
        } catch (error) {
          console.error("Error refreshing access token:", error);
          // Handle error refreshing access token (e.g., log out user)
        }
      }
    };

    refreshIfNeeded();
  }, [accessToken, refreshToken, dispatch]);

  const handleSnackbarClose = () => {
    setError(null); // Clear error state when Snackbar closes
  };

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
        <Grid container direction="column" spacing={3}>
          {posts.map((post) => (
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

export default Home;
