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
import { Link, useNavigate } from "react-router-dom";
import { loginAction } from "../../redux/actions/authActions";
import loginImage from "../../assets/login.svg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State to store login error

  const handleLogin = async () => {
    try {
      await dispatch(loginAction(username, password));
      navigate("/"); // Redirect to Home after successful login
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials."); // Set login error message
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
            image={loginImage}
            alt="Login Image"
            sx={{ objectFit: "cover", mb: 3 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Login
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error" align="center">
                  {error}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <Link to="/register" style={{ textDecoration: "none" }}>
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

export default Login;
