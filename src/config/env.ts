export const getEnvVars = () => {
  if (import.meta.env.MODE === "test") {
    return {
      VITE_API_URL: "http://localhost:3000/",
    };
  }

  return import.meta.env;
};

export const ENV = getEnvVars();
