import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError("");
    setLoading(true);
    axios
      .get("http://localhost:8000/auth/token", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setError(error.response.data.error);
        } else {
          setError(error.message);
        }
      });
  }, []);

  const handleRegister = async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/register",
        { username, password },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        { username, password },
        {
          withCredentials: true,
        }
      );
      setUser(response.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        handleRegister,
        handleLogin,
        handleLogout,
        error,
        setError,
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
