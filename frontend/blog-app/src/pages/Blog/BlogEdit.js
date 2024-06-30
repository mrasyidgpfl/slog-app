import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  fetchBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} from "../../services/blogs";
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

const BlogEdit = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isAuthenticated, accessToken, refreshToken, user } = useSelector(
    (state) => state.auth,
  );
  const isAuthenticatedFromSlices = useSelector(selectIsAuthenticated);
  const { title, content, categories, selectedCategories, image, fileName } =
    useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [imagePlaceholder, setImagePlaceholder] = useState(null);

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

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const blogPost = await fetchBlogPostById(blogId);
        dispatch(setTitle(blogPost.title));
        dispatch(setContent(blogPost.content));
        dispatch(setSelectedCategories(blogPost.categories || []));
        dispatch(
          setImage({
            image: blogPost.image || null,
            fileName: blogPost.image ? "Uploaded Image" : "",
          }),
        );
        setImagePlaceholder(blogPost.image || null);
      } catch (error) {
        console.error("Failed to fetch blog post", error);
        setError("Failed to fetch blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [dispatch, blogId]);

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
    setImagePlaceholder(URL.createObjectURL(file)); // Update placeholder with local URL
    if (file) {
      dispatch(setImage({ image: file, fileName: file.name }));
    } else {
      dispatch(setImage({ image: null, fileName: "" }));
    }
  };

  const handleUpdateBlog = async (draft) => {
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

      // Update blog post
      await updateBlogPost(blogId, postData, accessToken);
      setSnackbarMessage("Blog post updated successfully");
      dispatch(resetBlogState());
      navigate(`/blog/${blogId}`);
    } catch (error) {
      console.error("Error updating blog post:", error);
      setError("Failed to update blog post");
    }
  };

  const handleDeleteBlog = async () => {
    console.log("BLOG ID", blogId);
    try {
      await deleteBlogPost(blogId, accessToken);
      setSnackbarMessage("Blog post deleted successfully");
      dispatch(resetBlogState());
      navigate(`/profile/${user.username}`);
    } catch (error) {
      console.error("Error deleting blog post:", error);
      setError("Failed to delete blog post");
    }
  };

  const handleCancelEdit = () => {
    dispatch(resetBlogState());
    navigate(`/profile/${user.username}`);
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
            Edit Blog
          </Typography>
          {imagePlaceholder && (
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
                src={imagePlaceholder}
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
              <Grid
                container
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleUpdateBlog(true)}
                    sx={{ backgroundColor: "#26a69a", marginRight: "10px" }}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateBlog(false)}
                    sx={{ marginRight: "10px" }}
                  >
                    Update Blog
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteBlog}
                    sx={{ marginRight: "10px" }}
                  >
                    Delete Blog
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCancelEdit}
                    sx={{ backgroundColor: "#ffeb3b" }}
                  >
                    Cancel Edit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar
        open={!!error || !!snackbarMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error || snackbarMessage}
      />
    </Container>
  );
};

export default BlogEdit;
