import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    let json;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Autonamai/useriai/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

     
      try {
        json = await response.json();
      } catch (e) {
        json = null;
      }

      if (!response.ok) {
        setIsLoading(false);
        setError(json?.error || "Serverio klaida");
        return false;
      }

      // Login sėkmingas
      localStorage.setItem("user", JSON.stringify(json));
      localStorage.setItem("token", json.token);
      dispatch({ type: "LOGIN", payload: json });
      setIsLoading(false);
      return true;

    } catch (err) {
      setIsLoading(false);
      setError("Nepavyko prisijungti prie serverio");
      return false;
    }
  };

  return { login, isLoading, error };
};
