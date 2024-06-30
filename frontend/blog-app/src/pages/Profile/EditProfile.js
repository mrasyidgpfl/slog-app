/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { updateProfile } from "../../services/profile";
import { refreshAccessTokenAction } from "../../redux/actions/authActions";
import { isTokenExpired } from "../../utils/authUtils";
import { uploadImageToCloudinary } from "../../services/cloudinary";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = location.state || {};
  const { isAuthenticated, accessToken, refreshToken } = useSelector(
    (state) => state.auth,
  );
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [bio, setBio] = useState(profile?.bio || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profile?.image || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { username } = useParams();

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (isTokenExpired(accessToken)) {
        try {
          await dispatch(refreshAccessTokenAction(refreshToken));
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      }
    };
    refreshIfNeeded();
  }, [accessToken, refreshToken, dispatch]);

  useEffect(() => {
    const checkUserAccess = async () => {
      console.log("Current user:", user);
      console.log("Username from useParams:", username);

      if (!isAuthenticated || !profile || user.username !== username) {
        setShowUnauthorized(true);
        setTimeout(() => {
          navigate("/", { replace: true }); // Redirect to home page
        }, 3000); // Redirect after 3 seconds
      }
    };
    checkUserAccess();
  }, [isAuthenticated, profile, navigate, user, username]);

  const handleSnackbarClose = () => {
    setShowUnauthorized(false); // Ensure unauthorized message is closed on interaction
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedProfileData = {
        bio: bio,
      };

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("file", imageFile);
        imageData.append("upload_preset", "ulg3uoii"); // Cloudinary upload preset
        imageData.append("folder", "Slog"); // Cloudinary folder name

        const response = await uploadImageToCloudinary(imageData);
        updatedProfileData.image = response.secure_url;
      }

      const updatedProfile = await updateProfile(
        profile.id,
        updatedProfileData,
        accessToken,
      );
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate(`/profile/${profile.username}`, { replace: true });
      }, 3000);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  if (!isAuthenticated || !profile || user.username !== username) {
    return (
      <Container
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            borderLeft: "2px solid black",
            borderRight: "2px solid black",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Unauthorized access. Redirecting to home page...
          </Typography>
        </Box>
      </Container>
    );
  }

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
            <label htmlFor="image-upload">
              <Avatar
                alt="Profile Picture"
                src={previewUrl}
                sx={{
                  width: 400,
                  height: 400,
                  mr: 2,
                  cursor: "pointer",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </label>
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <Box sx={{ flex: 1, ml: 2 }}>
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
              <Button
                variant="contained"
                component="span"
                color="primary"
                sx={{ textTransform: "none", mb: 2 }}
                onClick={() => document.getElementById("image-upload").click()}
              >
                Change Avatar
              </Button>
              <Typography variant="body2">
                {imageFile ? imageFile.name : "No file chosen"}
              </Typography>
              <TextField
                id="bio"
                name="bio"
                label="Bio"
                variant="outlined"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ mt: 2, mb: 2, width: "100%" }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                  sx={{
                    textTransform: "none",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  component={Link}
                  to={`/profile/${profile.username}`}
                  variant="contained"
                  color="error"
                  sx={{
                    textTransform: "none",
                    marginTop: "10px",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={showUnauthorized}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Unauthorized access. Redirecting to home page..."
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
      >
        <Alert onClose={() => setErrorMessage("")} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowSuccessMessage(false)} severity="success">
          Profile updated successfully. Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
};

EditProfile.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }),
  isAuthenticated: PropTypes.bool.isRequired,
};

export default EditProfile;
