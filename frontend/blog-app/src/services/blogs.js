// services/blogs.js
import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Base API URL

// Function to fetch all blog posts
export const fetchBlogPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/blogs/`);
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }

    const data = await response.json();

    // Fetch likes and comments for each blog post
    const postsWithLikesAndComments = await Promise.all(
      data.map(async (post) => {
        // Fetch likes count
        const likesResponse = await fetch(
          `${API_URL}/blog-likes/count/${post.id}/`,
        );
        const likesData = await likesResponse.json();
        const likesCount = likesData.like_count;

        // Fetch comments count
        const commentsResponse = await fetch(
          `${API_URL}/comments/count/${post.id}/`,
        );
        const commentsData = await commentsResponse.json();
        const commentsCount = commentsData.comment_count;

        // Remove 'image/upload' from the image URL if present
        let image = post.image;
        if (image && image.startsWith("image/upload/")) {
          image = image.replace("image/upload/", "");
        }

        // Return updated post object with likes and comments count
        return {
          id: post.id.toString(),
          title: post.title,
          content: post.content,
          image: image,
          likes_count: likesCount,
          comments_count: commentsCount,
        };
      }),
    );

    return postsWithLikesAndComments;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

// Function to fetch blog posts for a specific user
export const fetchUserBlogs = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/blogs/user/${userId}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch user's blog posts");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user's blog posts:", error);
    throw error; // Propagate the error to handle it in the component
  }
};

// Function to create a new blog post
export const createBlogPost = async (postData) => {
  try {
    const response = await fetch(`${API_URL}/blogs/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error("Failed to create blog post");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error; // Propagate the error to handle it in the component
  }
};

// Function to update an existing blog post
export const updateBlogPost = async (postId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/blogs/update/${postId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error("Failed to update blog post");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error; // Propagate the error to handle it in the component
  }
};

// Function to delete a blog post
export const deleteBlogPost = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/blogs/delete/${postId}/`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete blog post");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error; // Propagate the error to handle it in the component
  }
};

export const likeBlog = async (userId, blogId) => {
  try {
    const response = await axios.post(`${API_URL}/blog-likes/create/`, {
      user_id: userId,
      blog_id: blogId,
    });
    return response.data;
  } catch (error) {
    console.error("Error liking blog:", error);
    throw error;
  }
};

export const unlikeBlog = async (bloglikeId, token) => {
  const response = await axios.delete(
    `${API_URL}/blog-likes/delete/${bloglikeId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const fetchLikeCount = async (blogId) => {
  try {
    const response = await axios.get(`${API_URL}/blog-likes/count/${blogId}/`);
    return response.data.like_count; // Assuming response structure has a 'count' property
  } catch (error) {
    console.error("Error fetching like count:", error);
    throw error;
  }
};

export const checkIfLiked = async (userId, postId) => {
  try {
    const response = await axios.get(`${API_URL}/blog-likes/`, {
      params: { user: parseInt(userId), blog: parseInt(postId) },
    });

    const like = response.data.find(
      (like) =>
        like.user === parseInt(userId) && like.blog === parseInt(postId),
    );

    return like ? like.id : null;
  } catch (error) {
    console.error("Error checking if liked:", error);
    return null; // Return null if there's an error
  }
};
