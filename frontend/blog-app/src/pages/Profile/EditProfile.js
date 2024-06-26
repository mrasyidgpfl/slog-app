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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { updateProfile } from "../../services/profile";
import { refreshAccessTokenAction } from "../../redux/actions/authActions";
import { isTokenExpired } from "../../utils/authUtils";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, isAuthenticated } = location.state || {};
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [bio, setBio] = useState(profile?.bio || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const user = useSelector((state) => state.auth.user?.username);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const refreshToken = useSelector((state) => state.auth.refreshToken);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (isTokenExpired(accessToken)) {
        try {
          await dispatch(refreshAccessTokenAction(refreshToken));
        } catch (error) {
          console.error("Error refreshing access token:", error);
          // Handle error refreshing access token (e.g., log out user)
        }
      }
    };

    refreshIfNeeded();
  }, [accessToken, refreshToken, dispatch]);

  useEffect(() => {
    if (!profile || !isAuthenticated || user !== profile.username) {
      setShowUnauthorized(true);
      setTimeout(() => {
        navigate("/", { replace: true }); // Redirect to home page
      }, 3000); // Redirect after 3 seconds
    }
  }, [isAuthenticated, profile, navigate, user]);

  const handleSnackbarClose = () => {
    setShowUnauthorized(false);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedProfileData = {
        bio: bio,
        // Add other fields like image_url if needed
      };
      const updatedProfile = await updateProfile(
        profile?.id,
        updatedProfileData,
        accessToken,
      ); // Replace profile?.id with actual userId
      console.log("Profile updated successfully:", updatedProfile);
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate(`/profile/${profile?.username}`, { replace: true });
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error("Error updating user profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  if (!profile || !isAuthenticated || user !== profile.username) {
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
            <Avatar
              alt="Profile Picture"
              src={profile?.image}
              sx={{ width: 400, height: 400, mr: 2 }}
            />
            <Box>
              <Typography variant="h5" gutterBottom>
                {profile?.firstName} {profile?.lastName}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                color="text.secondary"
              >
                @{profile?.username}
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
                sx={{ mt: 2, mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
                  to={`/profile/${profile?.username}`}
                  variant="contained"
                  color="primary"
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
        autoHideDuration={100}
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
