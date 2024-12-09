import { useState } from "react";
import axios from "axios";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const loginAxios = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/login`,
        {
          email,
          password,
        }
      );

      if (response.status !== 200) {
        throw new Error("Invalid credentials");
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  return {
    loginAxios,
    loading,
  };
};
