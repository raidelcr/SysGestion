export type UserRole = 'admin' | 'commercial' | 'operator' | 'supervisor' | 'warehouse';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface Contract {
  id: string;
  year: number;
  type: 'PN' | 'Empresa';
  orderNumber: string;
  client: string;
  product: string;
  valueCUP: number;
  valueUSD: number;
  startDate: string;
  endDate: string;
  status: 'pendiente de pago' | 'producción' | 'entregado' | 'cancelado';
}

export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

export interface SalesStats {
  totalSales: number;
  pendingContracts: number;
  activeOrders: number;
  monthlyRevenue: number;
}

export interface InventoryStats {
  totalProducts: number;
  lowStock: number;
  pendingDeliveries: number;
  totalValue: number;
}

export interface ModulePermission {
  action: 'read' | 'write' | 'execute' | 'admin';
  roles: UserRole[];
}

export interface Module {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  isActive: boolean;
  installedAt: string;
  size: number;
  dependencies?: string[];
  permissions: ModulePermission[];
}