import React, { useEffect } from "react";
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
import {
  logoutUser,
  refreshAccessTokenAction,
} from "../../redux/actions/authActions";
import { fetchUserProfile } from "../../services/profile";
import { isTokenExpired } from "../../utils/authUtils";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, accessToken, refreshToken } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        try {
          await dispatch(refreshAccessTokenAction(refreshToken));
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          // Handle token refresh error (e.g., logout user, show error message)
          await dispatch(logoutUser(refreshToken)); // Example: logout on token refresh failure
          navigate("/login"); // Redirect to login page
        }
      }
    };

    refreshIfNeeded();
  }, [accessToken, refreshToken, dispatch, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser(refreshToken));
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleCreateBlog = () => {
    navigate("/create");
  };

  const handleProfileClick = async () => {
    try {
      const username = user.username;
      const profile = await fetchUserProfile(username);

      if (profile) {
        navigate(`/profile/${username}`);
      } else {
        console.error(`Profile not found for username ${username}`);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
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
                <Button color="inherit" onClick={handleCreateBlog}>
                  Create Blog
                </Button>
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
