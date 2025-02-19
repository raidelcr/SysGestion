import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Package, Shield } from 'lucide-react';
import { useModuleStore } from '../store/moduleStore';
import { useAuthStore } from '../store/authStore';
import { ModuleManager } from '../utils/moduleManager';
import type { Module, ModulePermission, UserRole } from '../types';

export function Modules() {
  const { modules, addModule, removeModule, toggleModuleStatus, hasPermission, updateModulePermissions } = useModuleStore();
  const user = useAuthStore((state) => state.user);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setInstalling(true);
    setError(null);

    try {
      const module = await ModuleManager.installModule(file);
      addModule(module);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error installing module');
    } finally {
      setInstalling(false);
    }
  };

  const handleUninstall = async (moduleId: string) => {
    if (!hasPermission(moduleId, 'admin')) {
      setError('No tienes permisos para desinstalar este módulo');
      return;
    }

    try {
      await ModuleManager.uninstallModule(moduleId);
      removeModule(moduleId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uninstalling module');
    }
  };

  const handlePermissionChange = (
    moduleId: string,
    action: ModulePermission['action'],
    role: UserRole,
    checked: boolean
  ) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    const newPermissions = module.permissions.map((p) => {
      if (p.action === action) {
        return {
          ...p,
          roles: checked
            ? [...p.roles, role]
            : p.roles.filter((r) => r !== role),
        };
      }
      return p;
    });

    updateModulePermissions(moduleId, newPermissions);
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const allRoles: UserRole[] = ['admin', 'commercial', 'operator', 'supervisor', 'warehouse'];
  const allActions: ModulePermission['action'][] = ['read', 'write', 'execute', 'admin'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Módulos
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6">
          {/* Module Upload */}
          {user?.role === 'admin' && (
            <div className="mb-6">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="module-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click para subir</span> o arrastrar y soltar
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Archivos RAR o ZIP (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="module-upload"
                    type="file"
                    className="hidden"
                    accept=".rar,.zip"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={installing}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Installed Modules List */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Módulos Instalados
            </h3>
            
            {modules.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No hay módulos instalados
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {modules.map((module) => (
                  <div key={module.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {module.name} <span className="text-gray-500">v{module.version}</span>
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {module.description}
                        </p>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Por: {module.author}</span>
                          <span>•</span>
                          <span>Tamaño: {formatFileSize(module.size)}</span>
                          <span>•</span>
                          <span>
                            Instalado: {new Date(module.installedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {hasPermission(module.id, 'admin') && (
                          <>
                            <button
                              onClick={() => toggleModuleStatus(module.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                module.isActive
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {module.isActive ? 'Activo' : 'Inactivo'}
                            </button>
                            <button
                              onClick={() => setEditingPermissions(module.id)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Gestionar Permisos"
                            >
                              <Shield className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleUninstall(module.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Desinstalar"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Permissions Management */}
                    {editingPermissions === module.id && user?.role === 'admin' && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                            Gestión de Permisos
                          </h5>
                          <button
                            onClick={() => setEditingPermissions(null)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {allActions.map((action) => (
                            <div key={action} className="space-y-2">
                              <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {action}
                              </h6>
                              {allRoles.map((role) => {
                                const hasRole = module.permissions
                                  .find((p) => p.action === action)
                                  ?.roles.includes(role);
                                return (
                                  <label
                                    key={`${action}-${role}`}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={hasRole}
                                      onChange={(e) =>
                                        handlePermissionChange(
                                          module.id,
                                          action,
                                          role,
                                          e.target.checked
                                        )
                                      }
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                      {role}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}