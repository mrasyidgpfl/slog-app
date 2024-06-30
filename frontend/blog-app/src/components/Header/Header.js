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
  Avatar,
  ClickAwayListener,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  logoutUser,
  refreshAccessTokenAction,
} from "../../redux/actions/authActions";
import { fetchUserProfile } from "../../services/profile";
import { isTokenExpired } from "../../utils/authUtils";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import Categories from "../../components/Categories/Categories";
import { useTheme } from "@mui/material/styles";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, accessToken, refreshToken } = useSelector(
    (state) => state.auth,
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const [notLoginPage, setIsNotLoginPage] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const currentLocation = location.pathname.includes("/login");
    if (!currentLocation) {
      setIsNotLoginPage(true);
    }
  }, []);

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }
    const getAvatar = async () => {
      const profile = await fetchUserProfile(user.id);
      setAvatar(profile.image);
    };
    getAvatar();
  }, [user, notLoginPage]);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      const isLoginPage = location.pathname.includes("/login");
      if (accessToken && isTokenExpired(accessToken) && !isLoginPage) {
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
      navigate("/login");
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

  const handleAdminTableClick = () => {
    navigate("/admin");
  };

  // Check if the current route is Home or ViewProfile
  const isHomePage = location.pathname === "/";
  const isViewProfilePage = location.pathname.startsWith("/profile/");
  const isEditProfilePage = location.pathname.includes("/edit");

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
                {(isHomePage || (isViewProfilePage && !isEditProfilePage)) && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
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
          <Categories drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
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
                  {user.role === "admin" && (
                    <Grid item sx={{ minWidth: 120 }}>
                      <Button color="inherit" onClick={handleAdminTableClick}>
                        Admin Table
                      </Button>
                    </Grid>
                  )}
                  <Grid item>
                    <ClickAwayListener onClickAway={handleClickAway}>
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
                            slotProps={{
                              paper: {
                                sx: {
                                  maxWidth: 220,
                                  borderRadius: 4,
                                  boxShadow: 8,
                                  top: "100%",
                                  right: 0,
                                  mt: 0.5,
                                  zIndex: 1200,
                                  border: `1px solid ${theme.palette.primary.main}`,
                                },
                              },
                            }}
                            elevation={0}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                          >
                            <MenuItem
                              onClick={handleProfileClick}
                              sx={{
                                p: 2,
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                              }}
                            >
                              View Profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ p: 2 }}>
                              Logout
                            </MenuItem>
                          </Menu>
                          <Typography variant="body1" sx={{ marginLeft: 1 }}>
                            @{user.username}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ClickAwayListener>
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
