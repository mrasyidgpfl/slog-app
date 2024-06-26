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
import { logoutUser } from "../../redux/actions/authActions";
import { fetchUserProfile } from "../../services/profile";
import { refreshAccessTokenAction } from "../../redux/actions/authActions";
import { isTokenExpired } from "../../utils/authUtils";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, accessToken, refreshToken } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (isTokenExpired(accessToken)) {
        await dispatch(refreshAccessTokenAction(refreshToken));
      }
    };

    refreshIfNeeded();
  }, [accessToken, refreshToken, dispatch]);

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
