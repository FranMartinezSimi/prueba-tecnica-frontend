import axios from "axios";

export const loginAxios = async (email: string, password: string) => {
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
};
