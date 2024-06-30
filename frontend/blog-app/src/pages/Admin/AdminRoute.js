import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const AdminRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin" />;
  }

  return <Component {...rest} />;
};

AdminRoute.propTypes = {
  element: PropTypes.elementType.isRequired, // Ensure 'element' prop is of type elementType and required
};

export default AdminRoute;
