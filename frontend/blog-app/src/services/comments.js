import axios from "axios";
import config from "../config"; // Replace with your API base URL and import configuration

const API_URL = config.API_URL;

// Function to fetch all comments
export const fetchComments = async () => {
  try {
    const response = await axios.get(`${API_URL}/comments/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Function to fetch a single comment by comment_id
export const fetchCommentById = async (blogId) => {
  try {
    const response = await axios.get(`${API_URL}/comments/${blogId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comment ${blogId}:`, error);
    throw error;
  }
};

// Function to create a new comment
export const createComment = async (postId, content, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/comments/create/`,
      { post: postId, content },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// Function to update an existing comment
export const updateComment = async (commentId, content, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/comments/${commentId}/`,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error);
    throw error;
  }
};

// Function to delete a comment by comment_id
export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${commentId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};

// Function to fetch comment likes
export const fetchCommentLikes = async () => {
  try {
    const response = await axios.get(`${API_URL}/comment-likes/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comment likes:", error);
    throw error;
  }
};

// Function to like a comment
export const likeComment = async (userId, commentId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/comment-likes/create/`,
      { user_id: userId, comment_id: commentId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
};

// Function to unlike a comment
export const unlikeComment = async (commentId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/comment-likes/delete/${commentId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error unliking comment:", error);
    throw error;
  }
};

export const fetchCommentLikeCount = async (commentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/comment-likes/count/${commentId}/`,
    );
    return response.data.like_count;
  } catch (error) {
    console.error(`Error fetching like count for comment ${commentId}:`, error);
    throw error;
  }
};
