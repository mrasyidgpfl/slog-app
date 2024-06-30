import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import {
  Container,
  Typography,
  Box,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { fetchBlogPostById } from "../../services/blogs";
import { fetchUserProfile } from "../../services/profile";
import { formatDistanceToNow } from "date-fns";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth); // Define useSelector to access Redux state
  const userId = useSelector((state) => state.auth.user?.id); // Define userId from Redux state
  const parsedUserId = parseInt(userId, 10);

  // Placeholder functions to prevent undefined errors
  const checkIfLiked = async (userId, postId) => {
    // Implement your logic to check if the user has liked the post
    return null; // Placeholder return value
  };

  const fetchLikeCount = async (postId) => {
    // Implement your logic to fetch the like count for the post
    return 0; // Placeholder return value
  };

  const likeBlog = async (userId, postId, accessToken) => {
    // Implement your logic to like the blog post
    console.log("Like blog logic"); // Placeholder
  };

  const unlikeBlog = async (likeId, accessToken) => {
    // Implement your logic to unlike the blog post
    console.log("Unlike blog logic"); // Placeholder
  };

  const handleSnackbarClose = () => {
    setError(null); // Clear error state when Snackbar closes
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await fetchBlogPostById(blogId);
        setBlogPost(blogData);

        // Fetch author profile once blog data is fetched
        const profile = await fetchUserProfile(blogData.user_id);
        setAuthorProfile(profile);

        // Fetch initial like status and count
        const intUserId = parseInt(userId);
        const postId = parseInt(blogId);
        const likeId = await checkIfLiked(intUserId, postId);
        setIsLiked(!!likeId);
        const count = await fetchLikeCount(blogId);
        setLikeCount(count);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError("Failed to fetch blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, userId]);

  const handleLikeClick = async () => {
    try {
      if (!isAuthenticated) {
        console.error("User is not authenticated.");
        return;
      }

      const intUserId = parseInt(userId);
      const postId = parseInt(blogId);

      if (!isLiked) {
        // Like the blog post
        await likeBlog(intUserId, postId, accessToken);
        setLikeCount((prevCount) => prevCount + 1);
      } else {
        // Unlike the blog post
        const likeId = await checkIfLiked(intUserId, postId);
        await unlikeBlog(likeId, accessToken);
        setLikeCount((prevCount) => prevCount - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
    }
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
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                textAlign: "justify",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                hyphens: "auto",
              }}
            >
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
                {isAuthenticated && parsedUserId === blogPost.user_id && (
                  <Link
                    to={`/blog/edit/${blogId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        ml: 1,
                        fontSize: "0.75rem", // Adjust font size as needed
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#7b1fa2", // Adjust hover background color
                        },
                      }}
                    >
                      Edit Blog
                    </Button>
                  </Link>
                )}
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
                  maxHeight: "400px",
                  maxWidth: "800px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <CardMedia
                  component="img"
                  image={blogPost.image}
                  alt="Blog Cover"
                  sx={{
                    objectFit: "contain",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                />
              </Box>
            )}
            <Typography
              variant="body1"
              paragraph
              sx={{
                mt: 2,
                textAlign: "justify",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                hyphens: "auto",
              }}
              component="div"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          </CardContent>
          <CardContent
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingTop: "8px", // Adjust padding as needed
              marginTop: "16px", // Adjust margin as needed
            }}
          >
            <IconButton
              aria-label="like"
              onClick={handleLikeClick}
              disabled={!isAuthenticated}
            >
              <FavoriteIcon color={isLiked ? "secondary" : "action"} />
            </IconButton>
            <Typography>{String(likeCount)}</Typography>
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
