import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Base API URL

// Function to fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Propagate the error to handle it in the component
  }
};

// Function to fetch blogs by categories
export const fetchBlogsByCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/blog-categories/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by categories:", error);
    throw error; // Propagate the error to handle it in the component
  }
};
