import axios from "axios";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/papikos/image/upload";

export const uploadImageToCloudinary = async (imageData) => {
  try {
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, imageData);
    console.log("RESPONSE", response);
    return response.data;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
