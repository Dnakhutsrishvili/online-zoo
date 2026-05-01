import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface StoredUser {
  name: string;
  email: string;
}

type LoginFn = (_user: StoredUser) => void;
type LogoutFn = () => void;

interface UserContextType {
  user: StoredUser | null;
  login: LoginFn;
  logout: LogoutFn;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StoredUser | null>(() => {
    try {
      const raw = localStorage.getItem("zoo_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback<LoginFn>((user) => {
    localStorage.setItem("zoo_user", JSON.stringify(user));
    setUser(user);
  }, []);

  const logout = useCallback<LogoutFn>(() => {
    localStorage.removeItem("zoo_user");
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
