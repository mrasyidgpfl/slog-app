import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/actions/authActions";
import { fetchUserProfile } from "../../services/profile"; // Adjust the import path accordingly

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const refreshToken = useSelector((state) => state.auth.refreshToken); // Assuming refreshToken is in state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser(refreshToken)); // Dispatch the logout action with refreshToken
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error if needed
    }
  };

  const handleHomeClick = () => {
    navigate("/"); // Redirect to home page
  };

  const handleProfileClick = async () => {
    try {
      const username = user.username;
      const profile = await fetchUserProfile(username); // Fetch profile data

      if (profile) {
        navigate(`/profile/${username}`); // Navigate to /profile/username
      } else {
        console.error(`Profile not found for username ${username}`);
        // Handle profile not found scenario
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Handle error fetching profile
    }
  };

  const handleLoginClick = () => {
    navigate("/login"); // Redirect to login page
  };

  const handleRegisterClick = () => {
    navigate("/register"); // Redirect to register page
  };

  return (
    <Container>
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: "pointer" }}
              onClick={handleHomeClick}
            >
              Slog
            </Typography>
            {isAuthenticated ? (
              <>
                <Button color="inherit" onClick={handleProfileClick}>
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={handleLoginClick}>
                  Login
                </Button>
                <Button color="inherit" onClick={handleRegisterClick}>
                  Register
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </Container>
  );
};

export default Header;
