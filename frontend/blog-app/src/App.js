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
import BlogEdit from "./pages/Blog/BlogEdit";
import AdminTable from "./pages/Admin/AdminTable"; // Import the AdminTable component
import { store } from "./redux/store";
import { Provider } from "react-redux";
import DocumentTitle from "./components/DocumentTitle/DocumentTitle";
import AdminRoute from "./pages/Admin/AdminRoute";

const backgroundColor = "#f0f0f0";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <DocumentTitle />
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
              <Route path="/blog/edit/:blogId" element={<BlogEdit />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/profile/edit/:username" element={<EditProfile />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={<AdminRoute element={AdminTable} />}
              />{" "}
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
