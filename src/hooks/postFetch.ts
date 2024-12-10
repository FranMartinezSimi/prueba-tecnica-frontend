import { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedToken = localStorage.getItem("secret");
  if (storedToken && config.headers) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }
  return config;
});

interface PostFetchResponse<T> {
  createData: (data: Partial<T>) => Promise<T>;
  loading: boolean;
  error: string | null;
}

export const usePostFetch = <T>(endpoint: string): PostFetchResponse<T> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createData = async (data: Partial<T>): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<T>(endpoint, data);
      return response?.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Error desconocido");
      } else {
        setError("Error desconocido");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createData, loading, error };
};
