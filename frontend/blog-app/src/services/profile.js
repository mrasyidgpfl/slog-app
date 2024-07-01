import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Function to fetch user profile by username
export const fetchUserProfile = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/profile/${username}/`);
    const profile = response.data;

    console.log(response);

    let image = response.data.image;

    console.log(image);
    // Check if profile object and image property exist
    if (profile && image) {
      // Remove 'image/upload' from the image URL if present
      if (image.startsWith("image/upload/")) {
        image = image.replace("image/upload/", "");
      }
    }
    console.log(image);
    return {
      id: profile.id || null,
      username: profile.username || "",
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      bio: profile.bio || "",
      image: image,
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
};

// user_id
export const fetchUsername = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/profile/${id}/`);
    const profile = response.data;

    return {
      username: profile.username || "",
    };
  } catch (error) {
    console.error("Error fetching username data:", error);
    throw error;
  }
};

export const fetchUserProfileById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/profile/${userId}/`);
    const profile = response.data;

    let image = profile.image;

    // Check if profile object and image property exist
    if (profile && image) {
      // Remove 'image/upload' from the image URL if present
      if (image.startsWith("image/upload/")) {
        image = image.replace("image/upload/", "");
      }
    }

    return {
      id: profile.id || null,
      username: profile.username || "",
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      bio: profile.bio || "",
      image: image,
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
};

export const updateProfile = async (userId, profileData, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/profile/update/${userId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Add the bearer token here
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    const data = await response.json();
    return data; // Optionally return data if needed after update
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error; // Propagate the error to handle it in the component
  }
};

export const fetchProfiles = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/profiles/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error; // Propagate the error to handle it in the component
  }
};
