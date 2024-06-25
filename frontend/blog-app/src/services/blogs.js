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
