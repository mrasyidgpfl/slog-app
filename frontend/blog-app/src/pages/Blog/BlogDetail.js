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
  Chip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { fetchBlogPostById } from "../../services/blogs";
import { fetchUserProfile } from "../../services/profile";
import {
  fetchBlogsByCategories,
  fetchCategories,
} from "../../services/categories"; // Import fetchBlogsByCategories and fetchCategories from categories service
import { formatDistanceToNow } from "date-fns";
import Comment from "../../components/Comments/Comment";
import CommentField from "../../components/Comments/CommentField";
import { fetchCommentById } from "../../services/comments";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth); // Define useSelector to access Redux state
  const userId = useSelector((state) => state.auth.user?.id); // Define userId from Redux state
  const parsedUserId = parseInt(userId, 10);
  const [comments, setComments] = useState([]); // State for comments

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await fetchCommentById(blogId);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const commentsData = await fetchCommentById(blogId);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

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

  const fetchCategoriesForBlog = async () => {
    try {
      const blogCategories = await fetchBlogsByCategories();
      const postCategories = blogCategories
        .filter((item) => item.blog === parseInt(blogId))
        .map((item) => item.category);

      const allCategories = await fetchCategories();
      const mappedCategories = postCategories.map((categoryId) => {
        const category = allCategories.find((cat) => cat.id === categoryId);
        return category ? category.category_name : `Category ${categoryId}`;
      });

      setCategories(mappedCategories);
    } catch (error) {
      console.error("Error fetching and mapping categories:", error);
    }
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

        // Fetch categories associated with the blog
        await fetchCategoriesForBlog();
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

  if (loading) {
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
          <Typography variant="h5" gutterBottom>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

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
            <Box sx={{ mt: 2 }}>
              {categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
              ))}
            </Box>
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
              border: 1,
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
          {isAuthenticated && (
            <Card
              sx={{
                width: "100%",
                p: 2,
                mt: 2,
                borderRadius: 0,
                borderTop: 0.2,
              }}
            >
              <CommentField postId={blogId} onSubmit={fetchComments} />
            </Card>
          )}
          {/* Comments Section */}
          {comments.length > 0 ? (
            <Card sx={{ width: "100%", p: 2, mt: 2, borderRadius: 0 }}>
              <Typography variant="h5" gutterBottom>
                Comments
              </Typography>
              {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </Card>
          ) : (
            <Card sx={{ width: "100%", p: 2, mt: 0.5, mb: 2, borderRadius: 0 }}>
              <Typography variant="h5" gutterBottom>
                No comments yet.
              </Typography>
            </Card>
          )}
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
