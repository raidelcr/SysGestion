import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

const defaultUsers = [
  { 
    id: '1', 
    email: 'admin@sysgestion.cu', 
    password: 'admin123', 
    name: 'Administrator', 
    role: 'admin' as const
  },
  { 
    id: '2', 
    email: 'commercial@sysgestion.cu', 
    password: 'commercial123', 
    name: 'Commercial Agent', 
    role: 'commercial' as const
  },
  { 
    id: '3', 
    email: 'operator@sysgestion.cu', 
    password: 'operator123', 
    name: 'Sales Operator', 
    role: 'operator' as const
  },
  { 
    id: '4', 
    email: 'supervisor@sysgestion.cu', 
    password: 'supervisor123', 
    name: 'Supervisor', 
    role: 'supervisor' as const
  },
  { 
    id: '5', 
    email: 'almacen@sysgestion.cu', 
    password: 'almacen123', 
    name: 'Warehouse Manager', 
    role: 'warehouse' as const
  },
];

interface AuthState {
  user: Omit<User, 'password'> | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      users: defaultUsers,
      login: (email, password) => {
        const user = defaultUsers.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
      addUser: (userData) => {
        const newUser = {
          ...userData,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);