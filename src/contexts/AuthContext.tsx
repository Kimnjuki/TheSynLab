import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email?: string | null;
  name?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("convex_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("convex_user");
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, _password: string) => {
    // Simple mock auth for demo - in production, use Clerk or proper auth
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split("@")[0],
    };
    setUser(mockUser);
    localStorage.setItem("convex_user", JSON.stringify(mockUser));
  };

  const signUp = async (email: string, _password: string, name?: string) => {
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      name: name || email.split("@")[0],
    };
    setUser(mockUser);
    localStorage.setItem("convex_user", JSON.stringify(mockUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("convex_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: user ? { access_token: "mock_token" } : null,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
