import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
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
import { uploadImageToCloudinary } from "../../services/cloudinary"; // Assuming a service for Cloudinary upload

const BlogCreate = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // State for uploaded image
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
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

      // Upload image if available
      if (image) {
        const imageData = new FormData();
        imageData.append("file", image);
        imageData.append("upload_preset", "ulg3uoii"); // Cloudinary upload preset
        imageData.append("folder", "Slog"); // Cloudinary folder name

        const response = await uploadImageToCloudinary(imageData);
        postData.image = response.secure_url; // Include uploaded image URL in post data
      }

      // Create blog post
      await createBlogPost(postData, accessToken);
      setSnackbarMessage("Blog post created successfully");
      navigate("/");
    } catch (error) {
      console.error("Error creating blog post:", error);
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
        <Card sx={{ border: "2px solid black", flex: 1 }}>
          <CardContent sx={{ padding: "20px" }}>
            <Typography variant="h5" gutterBottom>
              Unauthorized access. Redirecting to home page...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <Container
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Card
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          borderRadius: 0,
          flex: 1,
        }}
      >
        <CardContent sx={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Create a Blog
          </Typography>
          <Grid container direction="column" spacing={3}>
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
            <Grid container item alignItems="center" spacing={1}>
              <Grid item>
                <Typography>Add image:</Typography>
              </Grid>
              <Grid item>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Grid>
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
