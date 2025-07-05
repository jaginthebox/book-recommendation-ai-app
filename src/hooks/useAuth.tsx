import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication service
class AuthService {
  private users: Array<{ id: string; email: string; password: string; name: string }> = [];
  private currentUser: User | null = null;

  constructor() {
    // Load user from localStorage on initialization
    const savedUser = localStorage.getItem('bookmind_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const authUser = { id: user.id, email: user.email, name: user.name };
    this.currentUser = authUser;
    localStorage.setItem('bookmind_user', JSON.stringify(authUser));
    return authUser;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (this.users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists');
    }

    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name
    };

    this.users.push(newUser);
    const authUser = { id: newUser.id, email: newUser.email, name: newUser.name };
    this.currentUser = authUser;
    localStorage.setItem('bookmind_user', JSON.stringify(authUser));
    return authUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('bookmind_user');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

const authService = new AuthService();

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const user = await authService.register(email, password, name);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};