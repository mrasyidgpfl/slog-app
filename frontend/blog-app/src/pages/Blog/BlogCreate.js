import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { refreshAccessTokenAction } from "../../redux/actions/authActions";
import { isTokenExpired } from "../../utils/authUtils";
import { createBlogPost } from "../../services/blogs";
import { fetchCategories } from "../../services/categories";

const BlogCreate = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isAuthenticated, accessToken, refreshToken } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (isTokenExpired(accessToken)) {
        try {
          await dispatch(refreshAccessTokenAction(refreshToken));
        } catch (error) {
          console.error("Error refreshing access token:", error);
          setError("Session expired. Please log in again.");
        }
      }
    };

    refreshIfNeeded();
  }, [accessToken, refreshToken, dispatch]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category],
    );
  };

  const handleCreateBlog = async (draft) => {
    try {
      const postData = {
        title,
        content,
        draft,
        hidden: false,
        categories: selectedCategories,
      };
      await createBlogPost(postData, accessToken);
      setSnackbarMessage("Blog post created successfully");
      navigate("/");
    } catch (error) {
      setError("Failed to create blog post");
    }
  };

  const handleSnackbarClose = () => {
    setError(null); // Clear error state when Snackbar closes
    setSnackbarMessage(""); // Clear success message when Snackbar closes
  };

  if (!isAuthenticated) {
    setTimeout(() => {
      navigate("/");
    }, 100);
    return (
      <Container
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            borderLeft: "2px solid black",
            borderRight: "2px solid black",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Unauthorized access. Redirecting to home page...
          </Typography>
        </Box>
      </Container>
    );
  }

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
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ mt: 1 }}>
              Write a blog!
            </Typography>
            <Grid container direction="column" spacing={3} sx={{ mt: 1 }}>
              <Grid item>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Content"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Grid>
              <Grid item>
                {error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {categories.map((category) => (
                      <Chip
                        key={category.id}
                        label={category.category_name}
                        onClick={() =>
                          handleCategorySelect(category.category_name)
                        }
                        color={
                          selectedCategories.includes(category.category_name)
                            ? "primary"
                            : "default"
                        }
                        variant={
                          selectedCategories.includes(category.category_name)
                            ? "filled"
                            : "outlined"
                        }
                      />
                    ))}
                  </Stack>
                )}
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCreateBlog(false)}
                >
                  Post Blog
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCreateBlog(true)}
                  sx={{ ml: 2 }}
                >
                  Save as Draft
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={!!error || !!snackbarMessage}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={error ? `Error: ${error}` : snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default BlogCreate;
