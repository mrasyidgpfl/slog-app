import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = (username, password) => {
    // Perform login logic, then set user
    const fakeUser = { username, token: "fakeToken" };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, login, logout };
};

export default useAuth;
