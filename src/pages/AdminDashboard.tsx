import React from 'react';
import { Users, Package, FileText, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    {
      title: 'Total de usuarios',
      value: '15',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      change: '+2 this month',
    },
    {
      title: 'Contratos Activos',
      value: '28',
      icon: <FileText className="w-6 h-6 text-green-600" />,
      change: '+5 this week',
    },
    {
      title: 'Total de Ganancias',
      value: '$125,200',
      icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
      change: '+12% from last month',
    },
    {
      title: 'Artículos en inventario',
      value: '842',
      icon: <Package className="w-6 h-6 text-purple-600" />,
      change: '24 low stock items',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'Contratos',
      message: 'Nuevo contrato realizado con numero de orden ""',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'Inventario',
      message: 'Alerta de stock bajo: Office Chairs',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'Venta',
      message: 'Gran venta completada: $12,000',
      time: '6 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {user?.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              {stat.icon}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actividades recientes
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    {activity.type === 'contract' && (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                    {activity.type === 'inventory' && (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    {activity.type === 'sale' && (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.message}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  System Status
                </span>
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Last Backup
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  2 hours ago
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Storage Usage
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  45% of 1TB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}