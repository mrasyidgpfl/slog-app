import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated } = location.state || {};
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      setShowUnauthorized(true);
      setTimeout(() => {
        navigate("/", { replace: true }); // Redirect to home page
      }, 3000); // Redirect after 3 seconds
    }

    // Cloudinary widget initialization and other useEffect logic
  }, [isAuthenticated, profile, navigate]);

  const handleSnackbarClose = () => {
    setShowUnauthorized(false);
  };

  if (!isAuthenticated || !profile) {
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
                defaultValue={profile?.bio}
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
                  to={`/profile/${profile?.username}`}
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
      <Snackbar
        open={showUnauthorized}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Unauthorized access. Redirecting to home page..."
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Reposition to center top
      />
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
  }),
  isAuthenticated: PropTypes.bool.isRequired,
};

export default EditProfile;
