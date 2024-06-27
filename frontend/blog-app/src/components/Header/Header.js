import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  Box,
  Avatar,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logoutUser,
  refreshAccessTokenAction,
} from "../../redux/actions/authActions";
import { fetchUserProfile } from "../../services/profile";
import { isTokenExpired } from "../../utils/authUtils";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, accessToken, refreshToken } = useSelector(
    (state) => state.auth,
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const getAvatar = async () => {
      const profile = await fetchUserProfile(user.id);
      setAvatar(profile.image);
    };
    getAvatar();
  }, [user]);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        try {
          await dispatch(refreshAccessTokenAction(refreshToken));
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          await dispatch(logoutUser(refreshToken));
          navigate("/login");
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

  const handleMenuToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid
              container
              sx={{
                cursor: "pointer",
                alignItems: "center",
                paddingLeft: { xs: 2, sm: 3, md: 5, lg: 10, xl: 35 },
              }}
            >
              <Grid item>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography
                  variant="h6"
                  component="div"
                  onClick={handleHomeClick}
                >
                  Slog
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={() => setDrawerOpen(false)}
              onKeyDown={() => setDrawerOpen(false)}
            >
              {/* Add your drawer content here */}
              <Typography variant="h6" component="div" sx={{ padding: 2 }}>
                Categories
              </Typography>
            </Box>
          </Drawer>
          <Grid item>
            <Grid
              container
              spacing={1}
              sx={{
                cursor: "pointer",
                paddingRight: { xs: 2, sm: 3, md: 5, lg: 10, xl: 35 },
              }}
              alignItems="center"
            >
              {isAuthenticated ? (
                <>
                  <Grid item sx={{ minWidth: 120 }}>
                    <Button
                      color="inherit"
                      startIcon={<AddIcon />}
                      onClick={handleCreateBlog}
                    >
                      Create
                    </Button>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      onClick={handleMenuToggle}
                      sx={{ alignItems: "center", position: "relative" }}
                    >
                      <Grid item>
                        <IconButton color="inherit">
                          <Avatar alt={user.username} src={avatar} />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClickAway}
                          sx={{ mt: 0.5 }}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <Box sx={{ width: 200 }}>
                            <MenuItem
                              onClick={handleProfileClick}
                              sx={{ p: 2 }}
                            >
                              View Profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ p: 2 }}>
                              Logout
                            </MenuItem>
                          </Box>
                        </Menu>
                        <Typography variant="body1" sx={{ marginLeft: 1 }}>
                          @{user.username}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item>
                    <Button color="inherit" onClick={handleLoginClick}>
                      Login
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button color="inherit" onClick={handleRegisterClick}>
                      Register
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
