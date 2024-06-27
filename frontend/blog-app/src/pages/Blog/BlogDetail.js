import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  Avatar,
} from "@mui/material";
import { fetchBlogPostById } from "../../services/blogs";
import { fetchUserProfile } from "../../services/profile";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await fetchBlogPostById(blogId);
        setBlogPost(blogData);

        // Fetch author profile once blog data is fetched
        const profile = await fetchUserProfile(blogData.user_id);
        setAuthorProfile(profile);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError("Failed to fetch blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleSnackbarClose = () => {
    setError(null); // Clear error state when Snackbar closes
  };

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <Container
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            borderLeft: "2px solid black",
            borderRight: "2px solid black",
            padding: "20px",
            display: "flex",
            flex: 1,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  // Format content with <br/> for new lines
  const formattedContent = blogPost.content.replace(/\n/g, "<br/>");

  return (
    <Container
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {blogPost.title}
            </Typography>
            {authorProfile && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1">Author:</Typography>
                <Avatar src={authorProfile.image} sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  <Link to={`/profile/${authorProfile.username}`}>
                    @{authorProfile.username}
                  </Link>
                </Typography>
              </Box>
            )}
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Created: {new Date(blogPost.created_datetime).toLocaleString()}
            </Typography>
            {blogPost.updated_datetime && (
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                Last Updated:{" "}
                {new Date(blogPost.updated_datetime).toLocaleString()}
              </Typography>
            )}
            <Box sx={{ mt: 1, mb: 4 }}>
              {blogPost.image && (
                <CardMedia
                  component="img"
                  image={blogPost.image}
                  alt="Blog Cover"
                  sx={{ objectFit: "cover", maxWidth: "100%" }}
                />
              )}
            </Box>
            <Typography
              variant="body1"
              paragraph
              sx={{ mt: 2, textAlign: "justify" }}
              component="div"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          </CardContent>
        </Card>
        <Snackbar
          open={!!error}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message={`Error: ${error}`}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
      </Box>
    </Container>
  );
};

export default BlogDetail;
