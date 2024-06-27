import React from "react";
import Box from "@mui/material/Box";
import "./Footer.css";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#7e57c2",
        color: "white",
        textAlign: "center",
        padding: "10px 0",
        margin: 0,
      }}
    >
      <div className="footer">2024</div>
    </Box>
  );
};

export default Footer;
