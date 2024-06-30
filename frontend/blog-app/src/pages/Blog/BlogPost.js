import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import { Box, CardMedia, Chip, Stack } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Avatar, Button } from "@mui/material";
import { fetchUsername, fetchUserProfile } from "../../services/profile";
import {
  likeBlog,
  unlikeBlog,
  fetchLikeCount,
  checkIfLiked,
} from "../../services/blogs";
import { useTheme } from "@mui/material/styles";
import {
  fetchBlogsByCategories,
  fetchCategories,
} from "../../services/categories";
import { Link, useNavigate } from "react-router-dom";

const BlogPost = ({ post }) => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id);
  const parsedUserId = parseInt(userId, 10);
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const truncateTitle = (text, charLimit, suffix) => {
    return text.length > charLimit ? text.slice(0, charLimit) + suffix : text;
  };

  const truncateByCharacters = (text, charLimit, suffix) => {
    const shouldTruncate = text.length > charLimit;
    return {
      text: shouldTruncate ? text.slice(0, charLimit) : text,
      hasSuffix: shouldTruncate,
    };
  };

  // Truncate title to 100 characters and add "-" if it exceeds the limit
  const truncatedTitle = truncateTitle(post.title, 100, "-");

  // Truncate content to 300 characters and add "(...open to read)" if it exceeds the limit
  const { text: truncatedContent, hasSuffix } = truncateByCharacters(
    post.content,
    300,
    " (...open to read)",
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { username } = await fetchUsername(post.user_id);
        setUsername(username);

        const profile = await fetchUserProfile(username);
        setProfileImage(profile.image);
      } catch (error) {
        console.error("Error fetching username or profile image:", error);
      }
    };

    fetchData();
  }, [post.id]);

  useEffect(() => {
    const fetchInitialLikeCount = async () => {
      try {
        const count = await fetchLikeCount(post.id);
        setLikeCount(count);
      } catch (error) {
        console.error("Error fetching initial like count:", error);
      }
    };

    fetchInitialLikeCount();
  }, [post.id]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (isAuthenticated && userId) {
        const intUserId = parseInt(userId);
        const postId = parseInt(post.id);
        const likeId = await checkIfLiked(intUserId, postId);
        setIsLiked(!!likeId);
      }
    };

    fetchLikeStatus();
  }, [isAuthenticated, userId, post.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogCategories = await fetchBlogsByCategories();
        const postCategories = blogCategories
          .filter((item) => item.blog === post.id)
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

    fetchData();
  }, [post.id]);

  const handleLikeClick = async (event) => {
    event.stopPropagation();
    try {
      if (!isAuthenticated) {
        console.error("User is not authenticated.");
        return;
      }

      const intUserId = parseInt(userId);
      const postId = parseInt(post.id);

      if (!isLiked) {
        await likeBlog(intUserId, postId);
        setLikeCount((prevCount) => prevCount + 1);
      } else {
        await unlikeBlog(postId);
        setLikeCount((prevCount) => prevCount - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
    }
  };

  const handleBlogPostClick = () => {
    navigate(`/blog/${post.id}`);
  };

  const handleEditBlogClick = (event) => {
    event.stopPropagation();
    navigate(`/blog/edit/${post.id}`);
  };

  return (
    <Card sx={{ position: "relative" }}>
      {isAuthenticated && parsedUserId === post.user_id && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 1,
          }}
        >
          {post.draft && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#26a69a",
                color: "white",
                cursor: "default",
                pointerEvents: "none",
                padding: theme.spacing(0.5, 1),
                minWidth: "auto",
                fontSize: theme.typography.pxToRem(12),
                textTransform: "none",
              }}
            >
              Draft
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditBlogClick}
            sx={{
              padding: theme.spacing(0.5, 1),
              minWidth: "auto",
              fontSize: theme.typography.pxToRem(12),
              textTransform: "none",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Edit Blog
          </Button>
        </Box>
      )}
      <CardContent style={{ cursor: "pointer" }} onClick={handleBlogPostClick}>
        {post.image && (
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
            }}
          >
            <CardMedia
              component="img"
              image={post.image}
              alt="Image"
              sx={{
                maxWidth: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                overflow: "hidden",
              }}
            />
          </Box>
        )}
        <Typography
          variant="h5"
          gutterBottom
          className="truncate"
          sx={{
            overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto",
          }}
        >
          {truncatedTitle}
        </Typography>
        <Stack direction="row" spacing={1} mb={2}>
          {categories.map((category) => (
            <Chip key={category} label={category} variant="outlined" />
          ))}
        </Stack>
        <Typography
          variant="body1"
          gutterBottom
          className="truncate"
          sx={{
            textAlign: "justify",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto",
          }}
        >
          {truncatedContent}
          {hasSuffix && (
            <Typography
              variant="body1"
              component="span"
              sx={{ color: theme.palette.primary.main }}
            >
              {" (...open to read)"}
            </Typography>
          )}
        </Typography>
      </CardContent>
      <CardContent
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {profileImage && (
            <Avatar
              alt="Profile Picture"
              src={profileImage}
              sx={{
                width: theme.spacing(4),
                height: theme.spacing(4),
                marginRight: theme.spacing(1),
              }}
            />
          )}
          {username && (
            <Typography
              variant="body1"
              component={Link}
              to={`/profile/${username}`}
              style={{
                color: theme.palette.primary.main,
                textDecoration: "none",
              }}
            >
              {"@" + username}
            </Typography>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "8px",
            }}
          >
            <IconButton onClick={handleLikeClick} aria-label="add to favorites">
              <FavoriteIcon color={isLiked ? "error" : "action"} />
            </IconButton>
            <Typography variant="body2">{likeCount}</Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "8px",
            }}
          >
            <IconButton aria-label="comments">
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography variant="body2">{post.comments_count}</Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

BlogPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    image: PropTypes.string,
    draft: PropTypes.bool,
    likes_count: PropTypes.number,
    comments_count: PropTypes.number,
  }).isRequired,
};

export default BlogPost;
