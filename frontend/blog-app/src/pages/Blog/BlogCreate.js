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
  CardMedia,
  Box,
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
  const { isAuthenticated, accessToken, refreshToken, user } = useSelector(
    (state) => state.auth,
  );
  const isAuthenticatedFromSlices = useSelector(selectIsAuthenticated);
  const { title, content, categories, selectedCategories, fileName } =
    useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to hold image URL
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (isTokenExpired(accessToken)) {
        try {
          await dispatch(refreshAccessTokenAction(refreshToken));
        } catch (error) {
          console.error("Error refreshing access token:", error);
          // Handle error appropriately
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
      : [category];

    dispatch(setSelectedCategories(updatedCategories));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(setImage({ image: file, fileName: file.name }));
      setImageUrl(URL.createObjectURL(file));
    } else {
      dispatch(setImage({ image: null, fileName: "" }));
      setImageUrl(null);
    }
  };

  const handleImageDelete = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
      dispatch(setImage({ image: null, fileName: "" }));
    }
  };

  const handleCreateBlog = async (draft) => {
    try {
      if (title.length > 100 || content.trim().split(/\s+/).length > 3000) {
        return; // Handle validation error
      }

      const postData = {
        title,
        content,
        draft,
        hidden: false,
        categories: selectedCategories,
      };

      if (imageUrl) {
        const imageData = new FormData();
        imageData.append("file", imageUrl);
        imageData.append("upload_preset", "ulg3uoii"); // Cloudinary upload preset
        imageData.append("folder", "Home/Slog"); // Cloudinary folder name

        const response = await uploadImageToCloudinary(imageData);
        postData.image = response ? response.secure_url : null;
      }

      await createBlogPost(postData, accessToken);
      setSnackbarMessage("Blog post created successfully");
      dispatch(resetBlogState());

      dispatch(setTitle(""));
      dispatch(setContent(""));
      dispatch(setSelectedCategories([]));
      dispatch(setImage({ image: null, fileName: "" }));

      if (draft) {
        navigate(`/profile/${user.username}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
      setSnackbarMessage("Failed to create blog post");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage("");
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
          {imageUrl && (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                image={imageUrl}
                alt="Image"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  marginBottom: "8px",
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {fileName}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleImageDelete}
                sx={{ mt: 1, backgroundColor: "red" }}
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
                rows={10}
                value={content}
                onChange={(e) => dispatch(setContent(e.target.value))}
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
            <Grid item>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="contained-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  component="span"
                  color="primary"
                  fullWidth
                >
                  Upload Image
                </Button>
              </label>
            </Grid>
            <Grid item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleCreateBlog(true)}
                  sx={{ backgroundColor: "#26a69a" }}
                >
                  Draft Blog
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCreateBlog(false)}
                  sx={{ ml: 2 }}
                >
                  Publish Blog
                </Button>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarMessage.length > 0}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default BlogCreate;
