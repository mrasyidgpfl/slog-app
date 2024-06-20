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
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { registerUser } from "../../redux/actions/authActions";
import registerImage from "../../assets/register.svg";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9-_]{1,10}$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }
    if (!usernameRegex.test(username)) {
      setUsernameError(true);
      return;
    }
    setEmailError(false);
    setUsernameError(false);
    setPasswordError(false);

    if (password.length < 8) {
      setPasswordError(true);
      return;
    }

    dispatch(registerUser({ email, password, username }));
    navigate("/profile");
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
      </Box>
    </Container>
  );
};

export default Register;
