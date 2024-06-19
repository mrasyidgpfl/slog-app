import React from "react";
import { Grid } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";

const backgroundColor = "#f0f0f0";

const App = () => {
  return (
    <Router>
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
        <Grid item xs style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Grid>
        <Grid item>
          <Footer />
        </Grid>
      </Grid>
    </Router>
  );
};

export default App;
