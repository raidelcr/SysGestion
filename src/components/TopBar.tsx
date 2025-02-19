import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

export function TopBar() {
  const { theme, setTheme } = useThemeStore();
  const user = useAuthStore((state) => state.user);

  const toggleTheme = () => {
    setTheme({
      ...theme,
      mode: theme.mode === 'light' ? 'dark' : 'light',
    });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bienvenido, {user?.name}
            </h2>
          </div>
          <div className="flex items-center space-x-6">
            {/* Color Theme Selector */}
            <div className="flex items-center space-x-2">
              
            </div>

            {/* Light/Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={theme.mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            >
              {theme.mode === 'light' ? (
                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun size={20} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}