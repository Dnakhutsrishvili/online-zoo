import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface StoredUser {
  name: string;
  email: string;
}

interface UserContextType {
  user: StoredUser | null;
  login: (user: StoredUser) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => {
    try {
      const raw = localStorage.getItem('zoo_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData: StoredUser) => {
    localStorage.setItem('zoo_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('zoo_user');
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}