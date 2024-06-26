import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import { fetchUsername, fetchUserProfile } from "../../services/profile";
import { useTheme } from "@mui/material/styles";

const BlogPost = ({ post }) => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const getUsernameAndImage = async () => {
      try {
        const { username } = await fetchUsername(post.id);
        setUsername(username);

        const profile = await fetchUserProfile(username);
        setProfileImage(profile.image);
      } catch (error) {
        console.error("Error fetching username or profile image:", error);
      }
    };

    getUsernameAndImage();
  }, [post.id]);

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
            <IconButton aria-label="like">
              <FavoriteIcon />
            </IconButton>
            <Typography>{post.likes_count}</Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

BlogPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    image: PropTypes.string,
    likes_count: PropTypes.number.isRequired,
    comments_count: PropTypes.number.isRequired,
  }).isRequired,
};

export default BlogPost;
