/* eslint-disable */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, useParams } from "react-router-dom";
import { fetchUserProfile } from "../../services/profile";
import ViewProfile from "./ViewProfile";
import EditProfile from "./EditProfile";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user && user.username) {
          const profileData = await fetchUserProfile(user.username);
          setProfile(profileData);
          setLoading(false);
        } else {
          setLoading(false); // Set loading to false if user or user.username is null
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Trigger useEffect whenever user changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Routes>
        <Route path=":username" element={<ViewProfile profile={profile} isAuthenticated={isAuthenticated} />} />
        <Route path="edit" element={<EditProfile profile={profile} isAuthenticated={isAuthenticated} />} />
      </Routes>
    </div>
  );
};

export default Profile;
