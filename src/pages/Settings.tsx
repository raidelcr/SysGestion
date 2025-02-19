import React, { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { Check } from 'lucide-react';

export function Settings() {
  const { theme, setTheme } = useThemeStore();
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const colors = [
    { name: 'Azul', value: '#2563eb' },
    { name: 'Rojo', value: '#dc2626' },
    { name: 'Verde', value: '#16a34a' },
    { name: 'Morado', value: '#9333ea' },
    { name: 'Naranja', value: '#ea580c' },
    { name: 'Turquesa', value: '#0d9488' },
  ];

  const handleColorChange = (color: string) => {
    setTheme({ ...theme, primaryColor: color });
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleThemeChange = (mode: 'light' | 'dark') => {
    setTheme({ ...theme, mode });
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuración del Sistema
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preferencias de Tema
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Color del Tema
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorChange(color.value)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        theme.primaryColor === color.value
                          ? 'border-gray-900 dark:border-white'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Modo de Visualización
                </h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`px-4 py-2 rounded-lg ${
                      theme.mode === 'light'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Claro
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`px-4 py-2 rounded-lg ${
                      theme.mode === 'dark'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Oscuro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información del Sistema
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Versión
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  1.0.0
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Última Actualización
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  15 de Marzo, 2024
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Licencia
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  Empresarial
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Check size={16} />
            <span>Configuración guardada correctamente</span>
          </div>
        </div>
      )}
    </div>
  );
}