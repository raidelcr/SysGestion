import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Module, UserRole, ModulePermission } from '../types';
import { useAuthStore } from './authStore';

interface ModuleState {
  modules: Module[];
  addModule: (module: Module) => void;
  removeModule: (moduleId: string) => void;
  toggleModuleStatus: (moduleId: string) => void;
  getModule: (moduleId: string) => Module | undefined;
  hasPermission: (moduleId: string, action: ModulePermission['action']) => boolean;
  updateModulePermissions: (moduleId: string, permissions: ModulePermission[]) => void;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      modules: [],
      addModule: (module) => {
        set((state) => ({
          modules: [...state.modules, module],
        }));
      },
      removeModule: (moduleId) => {
        set((state) => ({
          modules: state.modules.filter((m) => m.id !== moduleId),
        }));
      },
      toggleModuleStatus: (moduleId) => {
        const user = useAuthStore.getState().user;
        const module = get().modules.find((m) => m.id === moduleId);
        
        if (!module || !user) return;
        
        // Check if user has admin permission for the module
        const hasAdminPermission = module.permissions.some(
          (p) => p.action === 'admin' && p.roles.includes(user.role)
        );
        
        if (!hasAdminPermission) {
          console.error('Insufficient permissions to toggle module status');
          return;
        }

        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId ? { ...m, isActive: !m.isActive } : m
          ),
        }));
      },
      getModule: (moduleId) => {
        return get().modules.find((m) => m.id === moduleId);
      },
      hasPermission: (moduleId, action) => {
        const user = useAuthStore.getState().user;
        const module = get().modules.find((m) => m.id === moduleId);
        
        if (!module || !user) return false;
        
        return module.permissions.some(
          (p) => p.action === action && p.roles.includes(user.role)
        );
      },
      updateModulePermissions: (moduleId, permissions) => {
        const user = useAuthStore.getState().user;
        if (user?.role !== 'admin') {
          console.error('Only administrators can update module permissions');
          return;
        }

        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId ? { ...m, permissions } : m
          ),
        }));
      },
    }),
    {
      name: 'module-storage',
    }
  )
);