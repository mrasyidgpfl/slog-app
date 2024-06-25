import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const BlogPost = ({ post }) => {
  const truncateContent = (content) => {
    if (content.length > 300) {
      return content.substring(0, 300) + "..."; // Adjusted to 300 characters
    }
    return content;
  };

  const truncateTitle = (title) => {
    if (title.length > 100) {
      return title.substring(0, 100) + "..."; // Adjusted to 100 characters
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
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
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
