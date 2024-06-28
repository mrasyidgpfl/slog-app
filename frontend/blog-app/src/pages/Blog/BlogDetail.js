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
import { formatDistanceToNow } from "date-fns";

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
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            borderLeft: "2px solid black",
            borderRight: "2px solid black",
            padding: "20px",
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
          display: "flex",
          flex: 1,
        }}
      >
        <Card sx={{ width: "100%", minHeight: "100%" }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {blogPost.title}
            </Typography>
            {authorProfile && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1">Author:</Typography>
                <Avatar src={authorProfile.image} sx={{ ml: 1, mr: 1 }} />
                <Typography variant="subtitle1">
                  <Link to={`/profile/${authorProfile.username}`}>
                    @{authorProfile.username}
                  </Link>
                </Typography>
              </Box>
            )}
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Created:{" "}
              {formatDistanceToNow(new Date(blogPost.created_datetime), {
                addSuffix: true,
              })}
            </Typography>
            {blogPost.updated_datetime && (
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                Last Updated:{" "}
                {formatDistanceToNow(new Date(blogPost.updated_datetime), {
                  addSuffix: true,
                })}
              </Typography>
            )}
            {blogPost.image && (
              <Box
                sx={{
                  mt: 2,
                  mb: 4,
                  maxHeight: "400px", // Maximum height
                  maxWidth: "800px", // Maximum width
                  display: "flex", // Centering content
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  margin: "0 auto", // Center the Box horizontally
                }}
              >
                <CardMedia
                  component="img"
                  image={blogPost.image}
                  alt="Blog Cover"
                  sx={{
                    objectFit: "contain", // Maintain aspect ratio and fit within the container
                    maxHeight: "100%", // Constrain to the Box's height
                    maxWidth: "100%", // Constrain to the Box's width
                  }}
                />
              </Box>
            )}
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
