import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import { Box, CardMedia } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { fetchUsername, fetchUserProfile } from "../../services/profile";
import {
  likeBlog,
  unlikeBlog,
  fetchLikeCount,
  checkIfLiked,
} from "../../services/blogs";
import { useTheme } from "@mui/material/styles";

const BlogPost = ({ post }) => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count);
  const [blogLikeId, setBlogLikeId] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id);
  const token = useSelector((state) => state.auth.accessToken);
  const theme = useTheme();
  const navigate = useNavigate();

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
        setBlogLikeId(likeId);
      }
    };

    fetchLikeStatus();
  }, [isAuthenticated, userId, post.id]);

  const handleLikeClick = async (event) => {
    event.stopPropagation();
    try {
      if (!isAuthenticated) {
        console.error("User is not authenticated.");
        // Handle unauthenticated state, e.g., show message or redirect to login
        return;
      }

      const intUserId = parseInt(userId);
      const postId = parseInt(post.id);

      if (!isLiked) {
        await likeBlog(intUserId, postId);
        setIsLiked(true);
        const likeId = await checkIfLiked(intUserId, postId);
        setLikeCount((prevCount) => prevCount + 1);
        setBlogLikeId(likeId);
      } else {
        await unlikeBlog(blogLikeId, token);
        setIsLiked(false);
        setLikeCount((prevCount) => prevCount - 1);
        setBlogLikeId(null);
      }
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
    }
  };

  const truncateContent = (content) => {
    if (content.length > 300) {
      return content.substring(0, 300) + "...";
    }
    return content;
  };

  const truncateTitle = (title) => {
    if (title.length > 100) {
      return title.substring(0, 100) + "...";
    }
    return title;
  };

  const handleBlogPostClick = () => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <Card>
      <CardContent onClick={handleBlogPostClick} style={{ cursor: "pointer" }}>
        {post.image && (
          <Box
            sx={{
              mb: 2, // Equivalent to marginBottom: "16px"
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
        <Typography variant="h5" gutterBottom>
          {truncateTitle(post.title)}
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          style={{ textAlign: "justify" }}
        >
          {truncateContent(post.content)}
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
            style={{ display: "flex", alignItems: "center", marginRight: 10 }}
          >
            <IconButton
              aria-label="comments"
              onClick={(e) => e.stopPropagation()}
            >
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography>{post.comments_count}</Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="like"
              onClick={handleLikeClick}
              disabled={!isAuthenticated}
            >
              <FavoriteIcon color={isLiked ? "secondary" : "action"} />
            </IconButton>
            <Typography>{String(likeCount)}</Typography>
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
    likes_count: PropTypes.number.isRequired,
    comments_count: PropTypes.number.isRequired,
  }).isRequired,
};

export default BlogPost;
