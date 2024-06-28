import React from "react";
import { Grid } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import Register from "./pages/Register/Register";
import BlogCreate from "./pages/Blog/BlogCreate";
import BlogDetail from "./pages/Blog/BlogDetail";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import DocumentTitle from "./components/DocumentTitle/DocumentTitle"; // Import the new component

const backgroundColor = "#f0f0f0";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <DocumentTitle /> {/* Use the component to set the document title */}
        <Grid
          container
          direction="column"
          style={{
            minHeight: "100vh",
            backgroundColor: backgroundColor,
          }}
        >
          <Grid item>
            <Header />
          </Grid>
          <Grid item xs style={{ flexGrow: 1, paddingTop: "55px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create" element={<BlogCreate />} />
              <Route path="/blog/:blogId" element={<BlogDetail />} />
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
