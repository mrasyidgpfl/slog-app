// services/blogs.js

const API_URL = "http://localhost:8000/api"; // Base API URL

// Function to fetch all blog posts
export const fetchBlogPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/blogs/`);
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error; // Propagate the error to handle it in the component
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
