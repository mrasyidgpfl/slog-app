import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth); // Assuming auth reducer stores user details

  return (
    <div>
      <h2>Profile</h2>
      <p>Welcome, {user.username}!</p>
      {/* Display other profile details */}
    </div>
  );
};

export default Profile;
