import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  CardMedia,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { registerUser } from "../../redux/actions/authActions";
import registerImage from "../../assets/register.svg";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* eslint-disable */
  const auth = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9-_]{1,30}$/;
    const firstNameRegex = /^[a-zA-Z ]{1,30}$/;
    const lastNameRegex = /^[a-zA-Z ]{1,30}$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }
    if (!usernameRegex.test(username)) {
      setUsernameError(true);
      return;
    }
    if (!firstNameRegex.test(firstName)) {
      setFirstNameError(true);
      return;
    }
    if (!lastNameRegex.test(firstName)) {
      setFirstNameError(true);
      return;
    }

    setEmailError(false);
    setUsernameError(false);
    setPasswordError(false);
    setFirstNameError(false);
    setLastNameError(false);

    if (password.length < 8) {
      setPasswordError(true);
      return;
    }

    try {
      const response = await dispatch(
        registerUser({
          email,
          password,
          username,
          first_name: firstName,
          last_name: lastName,
          role: "user", // assuming "role" is fixed as "user"
        }),
      );

      const { token } = response;
      localStorage.setItem("token", token);

      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      setSnackbarMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
      setSnackbarOpen(true);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          padding: "20px 20px",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
          <CardMedia
            component="img"
            image={registerImage}
            alt="Register Image"
            sx={{ objectFit: "cover", mb: 3 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Register
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={usernameError}
                helperText={
                  usernameError
                    ? "Username must be 1-10 characters and only alphanumeric, dash, or underscore."
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={
                  emailError ? "Email must be in the format xxx@xxx.com" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={firstNameError}
                helperText={
                  firstNameError
                    ? "First name must be 1-30 characters and only alphabetical."
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={lastNameError}
                helperText={
                  lastNameError
                    ? "Last name must be 1-30 characters and only alphabetical."
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={
                  passwordError
                    ? "Password must be at least 8 characters long."
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleRegister}
              >
                Register
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Login instead
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Register;
