import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Box, Grid, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux"; // Import useSelector from react-redux to access state
import theme from "../../themes/theme"; // Import your custom theme
import { createComment } from "../../services/comments"; // Import your service function

const CommentField = ({ postId, onSubmit }) => {
  const [comment, setComment] = useState("");
  const accessToken = useSelector((state) => state.auth.accessToken); // Access accessToken from Redux state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Access isAuthenticated from Redux state

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!isAuthenticated || !accessToken) {
        // Handle case where user is not authenticated
        console.error("User is not authenticated.");
        return;
      }

      // Create a new comment using the service function
      const response = await createComment(postId, comment, accessToken);

      // Assuming the API returns the created comment, you can handle success here
      console.log("Comment created:", response);

      // Call the onSubmit callback to handle further actions in parent component
      onSubmit(response); // Pass the created comment data to the parent component

      // Clear comment field after submission
      setComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
      // Handle error as needed, e.g., show error message to user
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Add a comment"
          multiline
          rows={2}
          fullWidth
          variant="outlined"
          value={comment}
          onChange={handleCommentChange}
          sx={{ mr: 1 }}
        />
        <Grid sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary" // Use primary color from theme
              onClick={handleSubmit}
              disabled={!comment.trim()} // Disable button if comment is empty or only whitespace
            >
              Comment
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

CommentField.propTypes = {
  postId: PropTypes.number.isRequired, // Require postId prop as a number
  onSubmit: PropTypes.func.isRequired,
};

export default CommentField;
