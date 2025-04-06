import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setAuthState({
        user: JSON.parse(storedUser),
        accessToken: storedToken,
      });
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/users/login", { email, password });
    const { user, accessToken, refreshToken } = res.data;

    setAuthState({ user, accessToken });

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    setAuthState({ user: null, accessToken: null });
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  if (isLoading) return null; 

  return (
    <AuthContext.Provider value={{ user: authState.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
