import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: Theme = {
  mode: 'light',
  primaryColor: '#2563eb',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: initialState,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);