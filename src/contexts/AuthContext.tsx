'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const savedToken = localStorage.getItem("token");
    console.log('Saved Token:', savedToken);
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user-service/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      console.log('Response Status:', response.status);
      if (!response.ok) {
        throw new Error(`Auth check failed: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response Data:', responseData);
      const userData: User = responseData.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(savedToken);
    } catch (error) {
      console.error('Auth check failed:', error);
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${apiUrl}/auth-service/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error: ${response.status} - ${text}`);
    }

    const data: { access_token: string } = await response.json();
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);

    // Kullanıcı bilgilerini almak için tekrar `checkAuthStatus` çağır
    await checkAuthStatus();

    router.push('/profile');
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push('/login');
  };

  return (
      <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
