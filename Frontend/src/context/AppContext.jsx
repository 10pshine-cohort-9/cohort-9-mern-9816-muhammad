import React, { useEffect, useState } from "react";
import { dummyNotes } from "../assets/assets";
import { createContext } from "react";
import { RouterContextProvider } from "react-router-dom";
import axios from "axios";

export const AppContext = createContext();
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
if (!BACKEND_URL) {
  throw new Error("Api_baseUrl is not configured correctly");
}

const AppContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userProfile, setuserProfile] = useState(null);
    
    
  const getProfile = async () => {
    try {
      const response = await axios.get(BACKEND_URL + '/userdata/userprofile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Prfile response", response.data.profile);
      
      setuserProfile(response.data.profile);
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data || error);
    }
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect( () => {
    if (token) {
        getProfile();
    } else {
        setuserProfile(null)
    }
  }, [token])

  const value = {
    BACKEND_URL,
    token,
    login,
    logout,
    userProfile,
    setuserProfile
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
