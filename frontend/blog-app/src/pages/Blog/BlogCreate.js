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
  Box,
  CardMedia,
} from "@mui/material";
import { refreshAccessTokenAction } from "../../redux/actions/authActions";
import { isTokenExpired } from "../../utils/authUtils";
import { createBlogPost } from "../../services/blogs";
import { uploadImageToCloudinary } from "../../services/cloudinary";
import {
  setTitle,
  setContent,
  setCategories,
  setImage,
  setSelectedCategories,
  resetBlogState,
  fetchCategories,
} from "../../redux/slices/blogSlices";
import { selectIsAuthenticated } from "../../redux/slices/authSlices";

const BlogCreate = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isAuthenticated, accessToken, refreshToken } = useSelector(
    (state) => state.auth,
  );
  const isAuthenticatedFromSlices = useSelector(selectIsAuthenticated);
  const { title, content, categories, selectedCategories, image, fileName } =
    useSelector((state) => state.blog);
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
        const response = await dispatch(fetchCategories());
        dispatch(setCategories(response.payload));
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchAllCategories();
  }, [dispatch]);

  useEffect(() => {
    // Check authentication status when component mounts
    if (!isAuthenticated || !isAuthenticatedFromSlices) {
      navigate("/");
    }
  }, [isAuthenticated, isAuthenticatedFromSlices, navigate]);

  const handleCategorySelect = (category) => {
    const updatedCategories = selectedCategories
      ? selectedCategories.includes(category)
        ? selectedCategories.filter((cat) => cat !== category)
        : [...selectedCategories, category]
      : [category]; // Initialize as array if selectedCategories is null or undefined

    dispatch(setSelectedCategories(updatedCategories));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(setImage({ image: file, fileName: file.name }));
    } else {
      dispatch(setImage({ image: null, fileName: "" }));
    }
  };

  const handleImageDelete = () => {
    dispatch(setImage({ image: null, fileName: "" }));
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
      dispatch(resetBlogState());
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

  if (!isAuthenticated || !isAuthenticatedFromSlices) {
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
          {image && (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                position: "relative",
              }}
            >
              <CardMedia
                component="img"
                image={URL.createObjectURL(image)}
                alt="Image"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  overflow: "hidden",
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleImageDelete}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "red",
                }}
              >
                Delete
              </Button>
            </Box>
          )}
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => dispatch(setTitle(e.target.value))}
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
                onChange={(e) => dispatch(setContent(e.target.value))}
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
                  style={{ display: "none" }}
                  id="upload-image"
                />
                <label htmlFor="upload-image">
                  <Button
                    variant="contained"
                    component="span"
                    color="primary"
                    sx={{ textTransform: "none" }}
                  >
                    Upload Image
                  </Button>
                </label>
              </Grid>
              <Grid item>
                {fileName ? (
                  <Typography sx={{ ml: 1 }}>{fileName}</Typography>
                ) : (
                  <Typography sx={{ ml: 1 }}>No file chosen</Typography>
                )}
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
                        selectedCategories &&
                        selectedCategories.includes(category.category_name)
                          ? "primary"
                          : "default"
                      }
                      variant={
                        selectedCategories &&
                        selectedCategories.includes(category.category_name)
                          ? "filled"
                          : "outlined"
                      }
                    />
                  ))}
                </Stack>
              )}
            </Grid>
            <Grid item container justifyContent="space-between">
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCreateBlog(false)}
                  sx={{ textTransform: "none" }}
                >
                  Post Blog
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCreateBlog(true)}
                  sx={{ ml: 2, textTransform: "none" }}
                >
                  Save as Draft
                </Button>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {error && (
        <Snackbar
          open={!!error}
          message={error}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        />
      )}
      {snackbarMessage && (
        <Snackbar
          open={!!snackbarMessage}
          message={snackbarMessage}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        />
      )}
    </Container>
  );
};

export default BlogCreate;
