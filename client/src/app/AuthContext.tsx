import { useCreateUserMutation, useLoginUserMutation } from "@/state/api";
import { AuthContextType, User } from "@/types";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginUserMutation] = useLoginUserMutation();
  const [createUserMutation] = useCreateUserMutation();

  // **Check local storage for authentication data when app loads**
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // console.log('Attempting login for user:', username);
      const response = await loginUserMutation({ username, password }).unwrap();


      if (response.token) {
        const userData = {
          userId: response.user?.userId,
          username,
          profilePictureUrl: response?.user?.profilePictureUrl,
        };

        setUser(userData);
        setIsAuthenticated(true);

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("response", JSON.stringify(response, null, 3));

      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed. Please check your credentials and try again.");
    }
  };

  const signup = async (
    username: string,
    password: string,
    profilePictureUrl?: File
  ) => {
    try {
      // console.log('Starting signup process for:', username);

      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      if (profilePictureUrl) {
        formData.append('profilePicture', profilePictureUrl);
      }

      const response = await createUserMutation(formData).unwrap();
      console.log('Signup response received:', response);

      if (response.token) {
        const userData = {
          username,
          profilePictureUrl: response.user.profilePictureUrl,
        };

        setUser(userData);
        setIsAuthenticated(true);

        // **Persist the token and user data in local storage**
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userData));

        console.log('User state updated with profile:', response.user.profilePictureUrl);
      } else {
        throw new Error('Signup succeeded but no token received');
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Signup failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, user, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
