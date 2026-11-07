import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ShippingAddress } from '../types';
import { dataService } from '../services/dataService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  quickLogin: (role: 'customer' | 'admin') => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addShippingAddress: (address: ShippingAddress) => Promise<void>;
  deleteShippingAddress: (addressIndexOrId: string | number) => Promise<void>;
  setDefaultAddress: (addressIndexOrId: string | number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'shopease_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse cached auth user');
    }
    // Default to Sarah Chen customer for immediate rich demo browsing experience!
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  // Set default initial user on mount if none set
  useEffect(() => {
    const initializeAuth = async () => {
      const users = await dataService.getUsers();
      if (!user) {
        // Pre-fill Sarah Chen (customer) for instant preview convenience
        const defaultCustomer = users.find(u => u.email === 'sarah.chen@example.com') || users[1];
        if (defaultCustomer) {
          setUser(defaultCustomer);
        }
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password = 'password123') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const err = await res.json();
        return { success: false, message: err.error || 'Invalid credentials' };
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('shopease_auth_token', data.token);
      }
      setUser(data.user);
      return { success: true };
    } catch (e: any) {
      // Fallback
      const users = await dataService.getUsers();
      const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (found) {
        setUser(found);
        return { success: true };
      }
      return { success: false, message: 'Login failed. Please check credentials.' };
    }
  };

  const register = async (name: string, email: string, password = 'password123') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      if (!res.ok) {
        const err = await res.json();
        return { success: false, message: err.error || 'Registration failed' };
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('shopease_auth_token', data.token);
      }
      setUser(data.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, message: 'Server connection error during registration.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('shopease_auth_token');
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  const quickLogin = async (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      await login('admin@shopease.com', 'admin123');
    } else {
      await login('sarah.chen@example.com', 'password123');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const updated = await dataService.updateUser({ ...user, ...data });
      setUser(updated);
    } catch (e) {
      setUser({ ...user, ...data });
    }
  };

  const addShippingAddress = async (address: ShippingAddress) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('shopease_auth_token');
      const res = await fetch('/api/auth/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(address),
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, savedAddresses: data.addresses });
        return;
      }
    } catch (e) {
      console.warn('Fallback address adding:', e);
    }

    const addrWithId = {
      ...address,
      id: address.id || `addr-${Date.now()}`,
      isDefault: user.savedAddresses.length === 0 ? true : address.isDefault,
    };
    let list = [...user.savedAddresses];
    if (addrWithId.isDefault) {
      list = list.map(a => ({ ...a, isDefault: false }));
    }
    list.push(addrWithId);
    setUser({ ...user, savedAddresses: list });
  };

  const deleteShippingAddress = async (addressId: string | number) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('shopease_auth_token');
      const res = await fetch(`/api/auth/addresses/${addressId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, savedAddresses: data.addresses });
        return;
      }
    } catch (e) {
      console.warn('Fallback address deletion:', e);
    }

    const list = user.savedAddresses.filter((a, idx) => a.id !== addressId && idx !== addressId);
    if (list.length > 0 && !list.some(a => a.isDefault)) {
      list[0].isDefault = true;
    }
    setUser({ ...user, savedAddresses: list });
  };

  const setDefaultAddress = async (addressId: string | number) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('shopease_auth_token');
      const res = await fetch(`/api/auth/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, savedAddresses: data.addresses });
        return;
      }
    } catch (e) {
      console.warn('Fallback set default address:', e);
    }

    const list = user.savedAddresses.map((a, idx) => ({
      ...a,
      isDefault: a.id === addressId || idx === addressId,
    }));
    setUser({ ...user, savedAddresses: list });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        quickLogin,
        updateProfile,
        addShippingAddress,
        deleteShippingAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
