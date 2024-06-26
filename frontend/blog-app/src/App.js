import React from "react";
import { Grid } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import EditProfile from "./pages/Profile/EditProfile";
import store from "./redux/store"; // Import Redux store
import { Provider } from "react-redux";

const backgroundColor = "#f0f0f0";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Grid
          container
          direction="column"
          style={{ minHeight: "100vh", backgroundColor: backgroundColor }}
        >
          <Grid item>
            <Header />
          </Grid>
          <Grid item xs style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/profile/:username/edit" element={<EditProfile />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Grid>
          <Grid item>
            <Footer />
          </Grid>
        </Grid>
      </Router>
    </Provider>
  );
};

export default App;
