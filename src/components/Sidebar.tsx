import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingCart, 
  Package, 
  Users, 
  ClipboardList, 
  Settings,
  Store,
  Building2,
  Warehouse,
  LogOut,
  Puzzle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles: string[];
}

interface MenuSection {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

export function Sidebar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const menuSections: MenuSection[] = [
    {
      title: 'COMERCIAL',
      icon: <Building2 size={20} />,
      items: [
        {
          label: 'Contratos',
          icon: <FileText size={20} />,
          href: '/contracts',
          roles: ['admin', 'commercial', 'supervisor'],
        },
        {
          label: 'Órdenes de Trabajo',
          icon: <ClipboardList size={20} />,
          href: '/work-orders',
          roles: ['admin', 'commercial', 'supervisor'],
        },
      ],
    },
    {
      title: 'TIENDA',
      icon: <Store size={20} />,
      items: [
        {
          label: 'Ventas',
          icon: <ShoppingCart size={20} />,
          href: '/sales',
          roles: ['admin', 'operator', 'supervisor'],
        },
        {
          label: 'Productos',
          icon: <Package size={20} />,
          href: '/products',
          roles: ['admin', 'operator', 'supervisor'],
        },
      ],
    },
    {
      title: 'ALMACEN',
      icon: <Warehouse size={20} />,
      items: [
        {
          label: 'Inventario',
          icon: <Package size={20} />,
          href: '/warehouse',
          roles: ['admin', 'warehouse', 'supervisor'],
        },
        {
          label: 'Movimientos',
          icon: <ClipboardList size={20} />,
          href: '/movements',
          roles: ['admin', 'warehouse', 'supervisor'],
        },
      ],
    },
    {
      title: 'CONFIGURACION',
      icon: <Settings size={20} />,
      items: [
        {
          label: 'Usuarios',
          icon: <Users size={20} />,
          href: '/users',
          roles: ['admin'],
        },
        {
          label: 'Módulos',
          icon: <Puzzle size={20} />,
          href: '/modules',
          roles: ['admin'],
        },
      ],
    }
  ];

  const commonMenuItems: MenuItem[] = [
    {
      label: 'Panel Principal',
      icon: <LayoutDashboard size={20} />,
      href: '/',
      roles: ['admin', 'commercial', 'operator', 'supervisor', 'warehouse'],
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            SysGestion
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {/* Common menu items at the top */}
            {commonMenuItems
              .filter((item) => item.roles.includes(user?.role || ''))
              .map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                      location.pathname === item.href
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}

            {/* Section divider */}
            <li className="pt-4">
              <hr className="border-gray-200 dark:border-gray-700" />
            </li>

            {/* Menu sections */}
            {menuSections.map((section) => {
              const filteredItems = section.items.filter((item) =>
                item.roles.includes(user?.role || '')
              );

              if (filteredItems.length === 0) return null;

              return (
                <li key={section.title} className="pt-4">
                  <div className="px-4 mb-2 flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {section.icon}
                    <span className="ml-2">{section.title}</span>
                  </div>
                  <ul className="space-y-1">
                    {filteredItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                            location.pathname === item.href
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}