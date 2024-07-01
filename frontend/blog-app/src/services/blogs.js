// services/blogs.js
import axios from "axios";
import { fetchUserProfile } from "./profile";

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
        /* eslint-disable */
        // Return updated post object with likes and comments count
        return {
          id: post.id,
          user_id: post.user_id,
          title: post.title,
          content: post.content,
          image: image,
          likes_count: likesCount,
          comments_count: commentsCount,
          created_datetime: post.created_datetime,
        };
      }),
    );

    return postsWithLikesAndComments;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

// Function to fetch all blog posts
export const fetchAdminBlogPosts = async (accessToken) => {
  try {
    const response = await fetch(`${API_URL}/blogs/admin/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
        /* eslint-disable */
        // Return updated post object with likes and comments count
        return {
          id: post.id,
          user_id: post.user_id,
          title: post.title,
          content: post.content,
          image: image,
          draft: post.draft,
          hidden: post.hidden,
          likes_count: likesCount,
          comments_count: commentsCount,
          created_datetime: post.created_datetime,
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
export const fetchPublicBlogPosts = async (username) => {
  try {
    const profile = await fetchUserProfile(username);
    const response = await fetch(`${API_URL}/blogs/public/${profile.id}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch public blog posts");
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
          id: post.id,
          user_id: post.user_id,
          title: post.title,
          content: post.content,
          image: image,
          likes_count: likesCount,
          comments_count: commentsCount,
          created_datetime: post.created_datetime,
        };
      }),
    );

    return postsWithLikesAndComments;
  } catch (error) {
    console.error("Error fetching public blog posts:", error);
    return [];
  }
};

export const fetchPrivateBlogPosts = async (userId, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/blogs/private/${userId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch private blog posts");
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
          id: post.id,
          user_id: post.user_id,
          title: post.title,
          content: post.content,
          draft: post.draft,
          image: image,
          likes_count: likesCount,
          comments_count: commentsCount,
          created_datetime: post.created_datetime,
        };
      }),
    );

    return postsWithLikesAndComments;
  } catch (error) {
    console.error("Error fetching private blog posts:", error);
    return [];
  }
};

// Function to create a new blog post
export const createBlogPost = async (postData, token) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/create/`, postData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error; // Propagate the error to handle it in the component
  }
};

// Function to update an existing blog post
export const updateBlogPost = async (postId, updatedData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/blogs/${postId}/`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error; // Propagate the error to handle it in the component
  }
};

// Function to delete a blog post
export const deleteBlogPost = async (blogId, accessToken) => {
  try {
    const response = await axios.delete(`${API_URL}/blogs/delete/${blogId}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data; // Axios automatically parses JSON response
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error; // Propagate the error to handle it in the component
  }
};

export const likeBlog = async (userId, blogId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/blog-likes/create/`,
      {
        user_id: userId,
        blog_id: blogId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error liking blog:", error);
    throw error;
  }
};

export const unlikeBlog = async (likeId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/blog-likes/delete/${likeId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error unliking blog:", error);
    throw error;
  }
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

export const fetchBlogPostById = async (blogId) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${blogId}/`);
    const blog = response.data;

    // Remove 'image/upload' from the image URL if present
    let image = blog.image;
    if (image && image.startsWith("image/upload/")) {
      image = image.replace("image/upload/", "");
    }

    // Return updated post object with likes and comments count
    return {
      id: blog.id,
      user_id: blog.user_id,
      title: blog.title,
      content: blog.content,
      image: image,
      created_datetime: blog.created_datetime,
      updated_datetime: blog.updated_datetime,
      draft: false,
      hidden: false,
    };
  } catch (error) {
    console.error(`Error fetching blog post with ID ${blogId}:`, error);
    throw error;
  }
};