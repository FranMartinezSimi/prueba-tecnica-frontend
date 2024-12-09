import { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface DeleteFetchResponse<T> {
  deleteData: (id: number) => Promise<T>;
  loading: boolean;
  error: string | null;
}

export const useDeleteFetch = <T>(endpoint: string): DeleteFetchResponse<T> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteData = async (id: number): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.delete<T>(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      setError("Error al eliminar el dato");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading, error };
};
