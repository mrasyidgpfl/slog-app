import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import "./Footer.css";

const Footer = () => {
  return (
    <Container>
      <Box
        sx={{
          borderLeft: "2px solid black",
          borderRight: "2px solid black",
        }}
      >
        <div className="footer">This is the footer content</div>
      </Box>
    </Container>
  );
};

export default Footer;
