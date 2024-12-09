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

interface PutFetchResponse<T> {
  updateData: (id: number, data: Partial<T>) => Promise<T>;
  loading: boolean;
  error: string | null;
}

export const usePutFetch = <T>(): PutFetchResponse<T> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = async (id: number, data: Partial<T>): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put<T>(`/api/endpoint/${id}`, data);
      return response.data;
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

  return { updateData, loading, error };
};
