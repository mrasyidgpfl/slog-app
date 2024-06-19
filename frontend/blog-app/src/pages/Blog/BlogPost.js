import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const BlogPost = ({ post }) => {
  return (
    <Card>
      <CardContent>
        {post.media && (
          <div style={{ marginBottom: "16px" }}>
            <img
              src={post.media}
              alt="Media"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {post.content}
        </Typography>
      </CardContent>
      <CardContent
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "16px", // Adjust the gap as needed
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton aria-label="comments">
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography>{post.comments_id}</Typography>
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
    media: PropTypes.string,
    likes_count: PropTypes.string.isRequired,
    comments_id: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogPost;
