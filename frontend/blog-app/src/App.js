import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Grid from "@mui/material/Grid";

const App = () => {
  return (
    <Grid container direction="column" style={{ minHeight: "100vh" }}>
      <Grid item>
        <Header />
      </Grid>
      <Grid item xs>
        {/* Main content */}
        <div style={{ padding: "20px" }}>
          {/* Your main content */}
          <h1>Main Content Area</h1>
          <p>Sample text...</p>
          {/* Add more content to make the page scrollable */}
          <div style={{ height: "1500px" }}>Long content...</div>
        </div>
      </Grid>
      <Grid item>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default App;
