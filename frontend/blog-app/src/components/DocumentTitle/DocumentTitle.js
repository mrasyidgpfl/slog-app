import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const DocumentTitle = () => {
  const location = useLocation();

  let title;
  switch (location.pathname) {
    case "/":
      title = "Home - Slog";
      break;
    case "/login":
      title = "Login - Slog";
      break;
    case "/create":
      title = "Create Blog - Slog";
      break;
    case "/register":
      title = "Register - Slog";
      break;
    default:
      if (location.pathname.startsWith("/blog/")) {
        title = "Blog Detail - Slog";
      } else if (location.pathname.startsWith("/profile/")) {
        title = "Profile - Slog";
      } else {
        title = "Slog";
      }
      break;
  }

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default DocumentTitle;
