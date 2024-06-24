import React from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 0,
        }}
      >
        <Box
          sx={{
            borderLeft: "2px solid black",
            borderRight: "2px solid black",
            padding: "20px 20px",
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h4">Loading...</Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 0,
      }}
    >
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
          padding: "20px 20px",
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Profile</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Welcome, {user.username}!</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Change Profile Picture"
                fullWidth
                // Add functionality to change profile picture
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Update Bio (max 160 words)"
                fullWidth
                multiline
                rows={4}
                // Add functionality to update bio
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
