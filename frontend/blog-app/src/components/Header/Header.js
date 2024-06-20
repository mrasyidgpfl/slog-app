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
import { logout } from "../../services/auth";

const Header = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirect to login page after logout
  };

  const handleHomeClick = () => {
    navigate("/"); // Redirect to home page
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
              onClick={handleHomeClick} // Redirect to home page on click
            >
              Slog
            </Typography>
            {isAuthenticated ? (
              <>
                <Button color="inherit" onClick={() => navigate("/profile")}>
                  {user.username}
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate("/register")}>
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
