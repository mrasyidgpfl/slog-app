import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  Button,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";

const EditProfile = ({ profile, isAuthenticated }) => {
  useEffect(() => {
    const initializeCloudinaryWidget = () => {
      // Check if Cloudinary widget script is loaded
      if (window.cloudinary) {
        const myWidget = window.cloudinary.createUploadWidget(
          {
            cloudName: "papikos",
            uploadPreset: "ulg3uoii",
            folder: "Home/Slog",
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Upload successful:", result.info.secure_url);
              // Handle successful upload
            } else if (error) {
              console.error("Error uploading:", error);
              // Handle upload error
            }
          },
        );

        const uploadButtonId = "upload_widget"; // Ensure unique id for the button

        // Check if upload button already exists
        let uploadButton = document.getElementById(uploadButtonId);
        if (!uploadButton) {
          uploadButton = document.createElement("button");
          uploadButton.id = uploadButtonId;
          uploadButton.textContent = "Upload Image";
          uploadButton.style.padding = "10px 20px";
          uploadButton.style.backgroundColor = "#007bff"; // Use correct color syntax
          uploadButton.style.color = "#fff";
          uploadButton.style.border = "none";
          uploadButton.style.borderRadius = "5px";
          uploadButton.style.cursor = "pointer";
          uploadButton.style.marginTop = "20px";
          uploadButton.style.width = "auto"; // Adjust width as needed
          uploadButton.style.display = "inline-block"; // Ensure button stays within container
          uploadButton.style.textTransform = "none"; // Ensure text transform is same

          uploadButton.addEventListener("click", () => {
            myWidget.open();
          });

          // Append the button to the component's DOM
          document
            .getElementById("upload_button_container")
            .appendChild(uploadButton);
        }
      } else {
        console.error("Cloudinary widget script not loaded.");
      }
    };

    initializeCloudinaryWidget();
  }, []);

  return (
    <Container
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          padding: "20px",
          flex: 1,
        }}
      >
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box display="flex" alignItems="center">
            <Avatar
              alt="Profile Picture"
              src={profile.image}
              sx={{ width: 400, height: 400, mr: 2 }}
            />
            <Box>
              <Typography variant="h5" gutterBottom>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                color="text.secondary"
              >
                @{profile.username}
              </Typography>
              <TextField
                id="bio"
                name="bio"
                label="Bio"
                variant="outlined"
                defaultValue={profile.bio}
                fullWidth
                multiline
                rows={4}
                sx={{ mt: 2, mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  id="upload_widget"
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                >
                  Change Image
                </Button>
                <Button
                  component={Link}
                  to={`/profile/${profile.username}`}
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    marginTop: "10px",
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            id="upload_button_container"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "20px",
            }}
          />
        </Paper>
      </Box>
    </Container>
  );
};

EditProfile.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default EditProfile;
