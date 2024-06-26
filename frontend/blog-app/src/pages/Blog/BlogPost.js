import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Link } from "react-router-dom";
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
  const userId = useSelector((state) => state.auth.user?.id); // Assuming user object has an 'id' field
  const token = useSelector((state) => state.auth.accessToken); // Assuming accessToken is stored in auth state
  const theme = useTheme();

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

  const handleLikeClick = async () => {
    try {
      if (!isAuthenticated) {
        console.error("User is not authenticated.");
        // Handle unauthenticated state, e.g., show message or redirect to login
        return;
      }

      const intUserId = parseInt(userId);
      const postId = parseInt(post.id); // Convert post.id to integer if needed

      if (!isLiked) {
        await likeBlog(intUserId, postId);
        setIsLiked(true); // Update UI state to reflect liked status
        const likeId = await checkIfLiked(intUserId, postId);
        setLikeCount((prevCount) => prevCount + 1); // Optimistically update like count
        setBlogLikeId(likeId);
      } else {
        await unlikeBlog(blogLikeId, token);
        setIsLiked(false); // Update UI state to reflect unliked status
        setLikeCount((prevCount) => prevCount - 1); // Optimistically update like count
        setBlogLikeId(null); // Reset blogLikeId after unliking
      }

      if (isLiked) {
        await unlikeBlog(blogLikeId, token);
        setIsLiked(false); // Update UI state to reflect unliked status
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        await likeBlog(intUserId, postId);
        setIsLiked(true); // Update UI state to reflect liked status
        const likeId = await checkIfLiked(intUserId, postId);
        setBlogLikeId(likeId);
        setLikeCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
      // Handle error, e.g., show error message to user
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

  return (
    <Card>
      <CardContent>
        {post.image && (
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              padding: "16px",
            }}
          >
            <img
              src={post.image}
              alt="Image"
              style={{ maxWidth: "400px", maxHeight: "200px" }}
            />
          </div>
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
            <IconButton aria-label="comments">
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography>{post.comments_count}</Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="like"
              onClick={handleLikeClick}
              disabled={!isAuthenticated} // Disable if user is not authenticated
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
