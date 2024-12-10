import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/auth.context";

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

interface UseFetchResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  clearError: () => void;
}

interface FetchOptions {
  requiresAuth?: boolean;
  customHeaders?: Record<string, string>;
}
export const useFetch = <T>(
  endpoint: string,
  options: FetchOptions = { requiresAuth: true }
): UseFetchResponse<T> => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<number>(0);

  const memoizedOptions = useMemo(
    () => ({
      requiresAuth: options.requiresAuth ?? true,
      customHeaders: options.customHeaders ?? {},
    }),
    [options.requiresAuth, options.customHeaders]
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (memoizedOptions.requiresAuth && !isAuthenticated) {
        throw new Error("No hay una sesión activa");
      }

      const headers: Record<string, string> = {
        ...memoizedOptions.customHeaders,
      };

      const response = await api.get<T>(endpoint, { headers });
      setData(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Un error desconocido ha ocurrido");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, memoizedOptions, isAuthenticated]);

  const refetch = useCallback(async (): Promise<void> => {
    setVersion((v) => v + 1);
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, version]);

  return {
    data,
    loading,
    error,
    refetch,
    setData,
    clearError: () => setError(null),
  };
};
