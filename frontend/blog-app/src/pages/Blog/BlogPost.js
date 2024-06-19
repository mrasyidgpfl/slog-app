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
      return content.substring(0, 500) + "...";
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
        {post.media && (
          <div style={{ marginBottom: "16px" }}>
            <img
              src={post.media}
              alt="Media"
              style={{ maxWidth: "100%", height: "auto" }}
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
