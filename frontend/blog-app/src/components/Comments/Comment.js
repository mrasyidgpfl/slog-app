import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PropTypes from "prop-types";
import { likeComment, fetchCommentLikeCount } from "../../services/comments";
import { fetchUserProfileById } from "../../services/profile";
import { useSelector } from "react-redux";

const Comment = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");

  const { isAuthenticated, accessToken, user } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    fetchUserProfileById(comment.user)
      .then((profile) => {
        setAvatarUrl(profile.image);
        setUsername(profile.username);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });

    fetchCommentLikeCount(comment.id)
      .then((count) => {
        setLikeCount(count);
      })
      .catch((error) => {
        console.error("Error fetching like count:", error);
      });
  }, [comment.user, comment.id]);

  const handleLikeClick = async () => {
    try {
      if (!isAuthenticated) {
        console.error("User is not authenticated.");
        return;
      }

      setIsLiked(!isLiked);

      if (!isLiked) {
        setLikeCount(likeCount + 1);
      } else {
        setLikeCount(likeCount - 1);
      }

      await likeComment(user.id, comment.id, accessToken);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="body1" gutterBottom>
          {comment.content}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Avatar
              alt={username}
              src={avatarUrl}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Typography variant="subtitle2" component="span">
              @{username}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <IconButton
              aria-label="like"
              onClick={handleLikeClick}
              color={isLiked ? "secondary" : "default"}
            >
              <FavoriteIcon />
            </IconButton>
            <Typography>{likeCount}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.number.isRequired,
  }).isRequired,
};

export default Comment;
