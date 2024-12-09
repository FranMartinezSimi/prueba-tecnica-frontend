// hooks/useAxios.ts
import { useState, useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface UseAxiosResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  makeRequest: (config: AxiosRequestConfig) => Promise<T>;
}

export const useAxios = <T>(): UseAxiosResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(
    async (config: AxiosRequestConfig): Promise<T> => {
      try {
        setLoading(true);
        setError(null);

        const response = await api(config);
        setData(response.data);
        return response.data;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || "Ocurrió un error"
            : "Ocurrió un error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, makeRequest };
};
