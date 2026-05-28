/**
 * Shared Type Definitions for the SMM Panel System
 */

export interface User {
  id: string;
  username: string;
  balance: number;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface SMMService {
  id: string;
  name: string;
  price: number; // Price per 1000 items
  min: number;
  max: number;
  category: string;
  description: string;
  isProduct?: boolean;
  deliveryStock?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  username?: string; // For admin display
  serviceId: string;
  serviceName?: string; // For user/admin display
  link: string;
  quantity: number;
  charge: number;
  status: OrderStatus;
  createdAt: string;
  startCount?: number;
  completedAt?: string;
  deliveredItems?: string[];
  rating?: number;
  reviewComment?: string;
  notes?: string;
}

export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type TransactionType = 'deposit' | 'refund' | 'charge';

export interface Transaction {
  id: string;
  userId: string;
  username?: string; // For admin displays
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod: string;
  referenceCode: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
  walletBalance: number;
  servicesCount: number;
  // Admin stats
  totalUsers?: number;
  totalDeposited?: number;
  allOrdersCount?: number;
  pendingDepositsCount?: number;
}

export interface AppNotification {
  id: string;
  orderId: string;
  serviceName: string;
  oldStatus: string;
  newStatus: string;
  createdAt: string;
  read: boolean;
}

