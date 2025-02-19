import React from 'react';
import { Package, FileText, ShoppingCart, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function UserDashboard() {
  const user = useAuthStore((state) => state.user);

  const getStats = () => {
    switch (user?.role) {
      case 'commercial':
        return [
          {
            title: 'Active Contracts',
            value: '12',
            icon: <FileText className="w-6 h-6 text-blue-600" />,
            change: '+3 this week',
          },
          {
            title: 'Pending Orders',
            value: '5',
            icon: <Clock className="w-6 h-6 text-yellow-600" />,
            change: '2 urgent',
          },
          {
            title: 'Monthly Sales',
            value: '$45,200',
            icon: <ShoppingCart className="w-6 h-6 text-green-600" />,
            change: '+8% from last month',
          },
        ];
      case 'operator':
        return [
          {
            title: 'Daily Sales',
            value: '$2,850',
            icon: <ShoppingCart className="w-6 h-6 text-green-600" />,
            change: '+15% today',
          },
          {
            title: 'Products Sold',
            value: '28',
            icon: <Package className="w-6 h-6 text-blue-600" />,
            change: '12 items today',
          },
          {
            title: 'Available Stock',
            value: '245',
            icon: <Package className="w-6 h-6 text-yellow-600" />,
            change: '8 low stock items',
          },
        ];
      case 'warehouse':
        return [
          {
            title: 'Total Inventory',
            value: '842',
            icon: <Package className="w-6 h-6 text-blue-600" />,
            change: '15 categories',
          },
          {
            title: 'Pending Deliveries',
            value: '12',
            icon: <Clock className="w-6 h-6 text-yellow-600" />,
            change: '4 urgent',
          },
          {
            title: 'Low Stock Items',
            value: '24',
            icon: <Package className="w-6 h-6 text-red-600" />,
            change: 'Needs attention',
          },
        ];
      default:
        return [];
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {user?.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {/* Activity items specific to user role */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Last action completed at 2:30 PM
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  2 hours ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}