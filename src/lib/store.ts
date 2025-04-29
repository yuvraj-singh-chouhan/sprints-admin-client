
import { create } from 'zustand';

export type Status = 'idle' | 'loading' | 'success' | 'error';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  tags: string[];
  inventory: number;
  images: string[];
  vendor: string;
  variants: {
    size: string;
    color: string;
    inventory: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'pending' | 'rejected';
  products: number;
  revenue: number;
  rating: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'banned';
  orders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant: {
      size: string;
      color: string;
    };
  }[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'pending' | 'failed';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalOrders: number;
  totalRevenue: number;
  productsInStock: number;
  lowStockAlerts: number;
  recentActivities: {
    id: string;
    type: string;
    description: string;
    time: string;
  }[];
  salesTrends: {
    month: string;
    sales: number;
  }[];
  orderVolume: {
    month: string;
    orders: number;
  }[];
  categoryPerformance: {
    category: string;
    sales: number;
  }[];
}

interface StoreState {
  // Dashboard
  dashboardStats: DashboardStats | null;
  dashboardStatus: Status;
  fetchDashboardStats: () => Promise<void>;

  // Products
  products: Product[];
  productsStatus: Status;
  fetchProducts: () => Promise<void>;

  // Orders
  orders: Order[];
  ordersStatus: Status;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

  // Vendors
  vendors: Vendor[];
  vendorsStatus: Status;
  fetchVendors: () => Promise<void>;
  updateVendorStatus: (vendorId: string, status: 'active' | 'pending' | 'rejected') => Promise<void>;

  // Customers
  customers: Customer[];
  customersStatus: Status;
  fetchCustomers: () => Promise<void>;
}

// Mock data generators
const generateMockDashboardStats = (): DashboardStats => ({
  totalUsers: 1248,
  totalVendors: 86,
  totalOrders: 5674,
  totalRevenue: 897250,
  productsInStock: 1352,
  lowStockAlerts: 23,
  recentActivities: [
    { id: '1', type: 'order', description: 'New order #ORD-5674', time: '5 minutes ago' },
    { id: '2', type: 'vendor', description: 'New vendor registration', time: '1 hour ago' },
    { id: '3', type: 'product', description: 'New product added', time: '3 hours ago' },
    { id: '4', type: 'customer', description: 'New customer registration', time: '5 hours ago' },
  ],
  salesTrends: [
    { month: 'Jan', sales: 65000 },
    { month: 'Feb', sales: 72000 },
    { month: 'Mar', sales: 68000 },
    { month: 'Apr', sales: 75000 },
    { month: 'May', sales: 82000 },
    { month: 'Jun', sales: 91000 },
  ],
  orderVolume: [
    { month: 'Jan', orders: 420 },
    { month: 'Feb', orders: 460 },
    { month: 'Mar', orders: 440 },
    { month: 'Apr', orders: 480 },
    { month: 'May', orders: 520 },
    { month: 'Jun', orders: 580 },
  ],
  categoryPerformance: [
    { category: 'Running', sales: 35000 },
    { category: 'Basketball', sales: 28000 },
    { category: 'Casual', sales: 42000 },
    { category: 'Formal', sales: 18000 },
    { category: 'Sports', sales: 25000 },
  ],
});

const generateMockProducts = (): Product[] => [
  {
    id: 'prod-001',
    name: 'Air Runner Pro',
    description: 'Premium running shoes with advanced cushioning',
    price: 129.99,
    category: 'Running',
    subcategory: 'Performance',
    tags: ['running', 'cushioned', 'lightweight'],
    inventory: 45,
    images: ['https://picsum.photos/id/96/200/200'],
    vendor: 'SportTech Inc.',
    variants: [
      { size: '8', color: 'Black', inventory: 15 },
      { size: '9', color: 'Black', inventory: 18 },
      { size: '10', color: 'Black', inventory: 12 },
    ],
    createdAt: '2023-09-15T10:30:00Z',
    updatedAt: '2023-10-05T14:20:00Z',
  },
  {
    id: 'prod-002',
    name: 'Street Style X',
    description: 'Urban casual shoes with modern design',
    price: 89.99,
    category: 'Casual',
    subcategory: 'Street',
    tags: ['casual', 'urban', 'comfortable'],
    inventory: 72,
    images: ['https://picsum.photos/id/21/200/200'],
    vendor: 'Urban Styles Co.',
    variants: [
      { size: '8', color: 'White', inventory: 20 },
      { size: '9', color: 'White', inventory: 22 },
      { size: '10', color: 'White', inventory: 18 },
      { size: '8', color: 'Blue', inventory: 4 },
      { size: '9', color: 'Blue', inventory: 5 },
      { size: '10', color: 'Blue', inventory: 3 },
    ],
    createdAt: '2023-08-22T09:15:00Z',
    updatedAt: '2023-10-02T11:30:00Z',
  },
  {
    id: 'prod-003',
    name: 'Business Elite',
    description: 'Premium leather formal shoes for professionals',
    price: 159.99,
    category: 'Formal',
    subcategory: 'Business',
    tags: ['formal', 'leather', 'professional'],
    inventory: 38,
    images: ['https://picsum.photos/id/15/200/200'],
    vendor: 'Executive Footwear',
    variants: [
      { size: '8', color: 'Brown', inventory: 12 },
      { size: '9', color: 'Brown', inventory: 15 },
      { size: '10', color: 'Brown', inventory: 11 },
    ],
    createdAt: '2023-07-10T13:45:00Z',
    updatedAt: '2023-09-28T16:50:00Z',
  },
  {
    id: 'prod-004',
    name: 'Court Champion',
    description: 'High-performance basketball shoes',
    price: 139.99,
    category: 'Basketball',
    subcategory: 'Performance',
    tags: ['basketball', 'grip', 'support'],
    inventory: 52,
    images: ['https://picsum.photos/id/331/200/200'],
    vendor: 'SportTech Inc.',
    variants: [
      { size: '9', color: 'Red', inventory: 18 },
      { size: '10', color: 'Red', inventory: 15 },
      { size: '11', color: 'Red', inventory: 19 },
    ],
    createdAt: '2023-09-05T11:20:00Z',
    updatedAt: '2023-10-08T10:10:00Z',
  },
  {
    id: 'prod-005',
    name: 'Hiker Extreme',
    description: 'Durable hiking boots for all terrains',
    price: 149.99,
    category: 'Outdoor',
    subcategory: 'Hiking',
    tags: ['hiking', 'waterproof', 'durable'],
    inventory: 31,
    images: ['https://picsum.photos/id/17/200/200'],
    vendor: 'Nature Footwear',
    variants: [
      { size: '8', color: 'Green', inventory: 10 },
      { size: '9', color: 'Green', inventory: 12 },
      { size: '10', color: 'Green', inventory: 9 },
    ],
    createdAt: '2023-06-18T15:30:00Z',
    updatedAt: '2023-09-30T09:40:00Z',
  }
];

const generateMockOrders = (): Order[] => [
  {
    id: 'ORD-5674',
    customer: {
      id: 'cust-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
    },
    items: [
      {
        id: 'prod-001',
        name: 'Air Runner Pro',
        price: 129.99,
        quantity: 1,
        variant: {
          size: '9',
          color: 'Black',
        },
      }
    ],
    totalAmount: 129.99,
    status: 'pending',
    paymentStatus: 'paid',
    shippingAddress: '123 Main St, Springfield, IL 62701',
    createdAt: '2023-10-12T08:30:00Z',
    updatedAt: '2023-10-12T08:30:00Z',
  },
  {
    id: 'ORD-5673',
    customer: {
      id: 'cust-002',
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
    },
    items: [
      {
        id: 'prod-002',
        name: 'Street Style X',
        price: 89.99,
        quantity: 2,
        variant: {
          size: '8',
          color: 'White',
        },
      }
    ],
    totalAmount: 179.98,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: '456 Oak Ave, Portland, OR 97205',
    createdAt: '2023-10-11T14:15:00Z',
    updatedAt: '2023-10-12T09:20:00Z',
  },
  {
    id: 'ORD-5672',
    customer: {
      id: 'cust-003',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
    },
    items: [
      {
        id: 'prod-003',
        name: 'Business Elite',
        price: 159.99,
        quantity: 1,
        variant: {
          size: '10',
          color: 'Brown',
        },
      },
      {
        id: 'prod-004',
        name: 'Court Champion',
        price: 139.99,
        quantity: 1,
        variant: {
          size: '10',
          color: 'Red',
        },
      }
    ],
    totalAmount: 299.98,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: '789 Pine St, Austin, TX 78701',
    createdAt: '2023-10-10T11:45:00Z',
    updatedAt: '2023-10-12T10:30:00Z',
  },
  {
    id: 'ORD-5671',
    customer: {
      id: 'cust-004',
      name: 'Sophia Garcia',
      email: 'sophia.garcia@example.com',
    },
    items: [
      {
        id: 'prod-005',
        name: 'Hiker Extreme',
        price: 149.99,
        quantity: 1,
        variant: {
          size: '9',
          color: 'Green',
        },
      }
    ],
    totalAmount: 149.99,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: '101 Maple Rd, Denver, CO 80202',
    createdAt: '2023-10-08T16:20:00Z',
    updatedAt: '2023-10-12T11:10:00Z',
  },
  {
    id: 'ORD-5670',
    customer: {
      id: 'cust-005',
      name: 'William Davis',
      email: 'william.davis@example.com',
    },
    items: [
      {
        id: 'prod-001',
        name: 'Air Runner Pro',
        price: 129.99,
        quantity: 1,
        variant: {
          size: '8',
          color: 'Black',
        },
      },
      {
        id: 'prod-002',
        name: 'Street Style X',
        price: 89.99,
        quantity: 1,
        variant: {
          size: '8',
          color: 'Blue',
        },
      }
    ],
    totalAmount: 219.98,
    status: 'cancelled',
    paymentStatus: 'refunded',
    shippingAddress: '202 Elm St, Miami, FL 33101',
    createdAt: '2023-10-07T09:50:00Z',
    updatedAt: '2023-10-12T12:40:00Z',
  }
];

const generateMockVendors = (): Vendor[] => [
  {
    id: 'vend-001',
    name: 'SportTech Inc.',
    email: 'contact@sporttech.com',
    phone: '+1-555-123-4567',
    address: '123 Sport Ave, Boston, MA 02108',
    status: 'active',
    products: 48,
    revenue: 225000,
    rating: 4.8,
    createdAt: '2022-05-15T10:00:00Z',
  },
  {
    id: 'vend-002',
    name: 'Urban Styles Co.',
    email: 'info@urbanstyles.com',
    phone: '+1-555-234-5678',
    address: '456 Fashion St, New York, NY 10001',
    status: 'active',
    products: 72,
    revenue: 310000,
    rating: 4.6,
    createdAt: '2022-06-22T14:30:00Z',
  },
  {
    id: 'vend-003',
    name: 'Executive Footwear',
    email: 'support@execfootwear.com',
    phone: '+1-555-345-6789',
    address: '789 Business Rd, Chicago, IL 60601',
    status: 'active',
    products: 36,
    revenue: 175000,
    rating: 4.7,
    createdAt: '2022-07-10T09:15:00Z',
  },
  {
    id: 'vend-004',
    name: 'Nature Footwear',
    email: 'hello@naturefootwear.com',
    phone: '+1-555-456-7890',
    address: '101 Outdoor Ln, Seattle, WA 98101',
    status: 'active',
    products: 42,
    revenue: 187000,
    rating: 4.5,
    createdAt: '2022-08-05T11:20:00Z',
  },
  {
    id: 'vend-005',
    name: 'Fashion Forward',
    email: 'contact@fashionforward.com',
    phone: '+1-555-567-8901',
    address: '202 Trend Blvd, Los Angeles, CA 90001',
    status: 'pending',
    products: 0,
    revenue: 0,
    rating: 0,
    createdAt: '2023-10-10T15:45:00Z',
  }
];

const generateMockCustomers = (): Customer[] => [
  {
    id: 'cust-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-123-4567',
    address: '123 Main St, Springfield, IL 62701',
    status: 'active',
    orders: 8,
    totalSpent: 1249.92,
    createdAt: '2022-08-15T10:30:00Z',
  },
  {
    id: 'cust-002',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    phone: '+1-555-234-5678',
    address: '456 Oak Ave, Portland, OR 97205',
    status: 'active',
    orders: 5,
    totalSpent: 779.95,
    createdAt: '2022-09-22T14:15:00Z',
  },
  {
    id: 'cust-003',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1-555-345-6789',
    address: '789 Pine St, Austin, TX 78701',
    status: 'active',
    orders: 12,
    totalSpent: 1859.88,
    createdAt: '2022-07-10T09:45:00Z',
  },
  {
    id: 'cust-004',
    name: 'Sophia Garcia',
    email: 'sophia.garcia@example.com',
    phone: '+1-555-456-7890',
    address: '101 Maple Rd, Denver, CO 80202',
    status: 'active',
    orders: 3,
    totalSpent: 449.97,
    createdAt: '2022-10-05T16:20:00Z',
  },
  {
    id: 'cust-005',
    name: 'William Davis',
    email: 'william.davis@example.com',
    phone: '+1-555-567-8901',
    address: '202 Elm St, Miami, FL 33101',
    status: 'banned',
    orders: 2,
    totalSpent: 269.98,
    createdAt: '2022-11-18T11:10:00Z',
  }
];

// Create the store
export const useStore = create<StoreState>((set) => ({
  // Dashboard
  dashboardStats: null,
  dashboardStatus: 'idle',
  fetchDashboardStats: async () => {
    set({ dashboardStatus: 'loading' });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const stats = generateMockDashboardStats();
      set({ dashboardStats: stats, dashboardStatus: 'success' });
    } catch (error) {
      set({ dashboardStatus: 'error' });
      console.error('Error fetching dashboard stats:', error);
    }
  },

  // Products
  products: [],
  productsStatus: 'idle',
  fetchProducts: async () => {
    set({ productsStatus: 'loading' });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const products = generateMockProducts();
      set({ products, productsStatus: 'success' });
    } catch (error) {
      set({ productsStatus: 'error' });
      console.error('Error fetching products:', error);
    }
  },

  // Orders
  orders: [],
  ordersStatus: 'idle',
  fetchOrders: async () => {
    set({ ordersStatus: 'loading' });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const orders = generateMockOrders();
      set({ orders, ordersStatus: 'success' });
    } catch (error) {
      set({ ordersStatus: 'error' });
      console.error('Error fetching orders:', error);
    }
  },
  updateOrderStatus: async (orderId, status) => {
    set((state) => ({
      orders: state.orders.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() } 
          : order
      )
    }));
  },

  // Vendors
  vendors: [],
  vendorsStatus: 'idle',
  fetchVendors: async () => {
    set({ vendorsStatus: 'loading' });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const vendors = generateMockVendors();
      set({ vendors, vendorsStatus: 'success' });
    } catch (error) {
      set({ vendorsStatus: 'error' });
      console.error('Error fetching vendors:', error);
    }
  },
  updateVendorStatus: async (vendorId, status) => {
    set((state) => ({
      vendors: state.vendors.map(vendor => 
        vendor.id === vendorId 
          ? { ...vendor, status } 
          : vendor
      )
    }));
  },

  // Customers
  customers: [],
  customersStatus: 'idle',
  fetchCustomers: async () => {
    set({ customersStatus: 'loading' });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const customers = generateMockCustomers();
      set({ customers, customersStatus: 'success' });
    } catch (error) {
      set({ customersStatus: 'error' });
      console.error('Error fetching customers:', error);
    }
  },
}));
