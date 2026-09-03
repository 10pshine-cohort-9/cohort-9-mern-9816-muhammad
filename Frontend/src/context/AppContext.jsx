import React, { useEffect, useState } from "react";
import { dummyNotes } from "../assets/assets";
import { createContext } from "react";
import { RouterContextProvider } from "react-router-dom";
import axios from "axios";
import { showSuccess } from "../utils/reactToastify";
import { BACKEND_URL } from "../config";
export const AppContext = createContext();

if (!BACKEND_URL) {
  throw new Error("Api_baseUrl is not configured correctly");
}

const AppContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userProfile, setuserProfile] = useState(null);
    
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    showSuccess("You are Logged Out successfully")
  };

  useEffect( () => {
    if (!token) {
        setuserProfile(null);
        return
    }
    const currentToken = token;
    const controller = new AbortController();

    const getProfile = async () => {
   
      
      try {
        const response = await axios.get(BACKEND_URL + '/userdata/userprofile', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          signal: controller.signal
        },
      });

      if (!controller.signal.aborted) {
        console.log("Prfile got");
        console.log(response.data.profile)
        setuserProfile(response.data.profile);
        
      }
      
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data || error);
    }
  };
    getProfile()
    
    return ()=> {
      controller.abort()
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
