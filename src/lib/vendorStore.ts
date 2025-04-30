
import { create } from 'zustand';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  address: string;
  status: 'active' | 'inactive';
  productsCount: number;
  revenue: number;
  createdAt: string;
}

interface VendorStore {
  vendors: Vendor[];
  vendorsStatus: 'idle' | 'loading' | 'loaded' | 'error';
  fetchVendors: () => Promise<void>;
}

// Mock data for vendors
const mockVendors: Vendor[] = [
  {
    id: "v1",
    name: "ShoeTech Inc.",
    email: "contact@shoetech.com",
    phone: "555-123-4567",
    contactPerson: "John Smith",
    address: "123 Tech Street, Footwear City, CA 92111",
    status: "active",
    productsCount: 45,
    revenue: 124500.00,
    createdAt: "2023-01-15T09:00:00.000Z"
  },
  {
    id: "v2",
    name: "Athletic Soles",
    email: "info@athleticsoles.com",
    phone: "555-987-6543",
    contactPerson: "Lisa Johnson",
    address: "456 Sport Avenue, Runner's Valley, NY 10012",
    status: "active",
    productsCount: 32,
    revenue: 98700.50,
    createdAt: "2023-02-20T14:30:00.000Z"
  },
  {
    id: "v3",
    name: "Trendy Footwear",
    email: "orders@trendyfootwear.com",
    phone: "555-456-7890",
    contactPerson: "Michael Chen",
    address: "789 Fashion Blvd, Style District, CA 90210",
    status: "inactive",
    productsCount: 18,
    revenue: 45200.75,
    createdAt: "2023-03-10T11:15:00.000Z"
  },
  {
    id: "v4",
    name: "Comfort Step",
    email: "support@comfortstep.com",
    phone: "555-333-2222",
    contactPerson: "Sarah Williams",
    address: "101 Cozy Lane, Relaxville, TX 75001",
    status: "active",
    productsCount: 27,
    revenue: 76800.25,
    createdAt: "2023-04-05T08:45:00.000Z"
  },
  {
    id: "v5",
    name: "Luxury Soles",
    email: "concierge@luxurysoles.com",
    phone: "555-888-9999",
    contactPerson: "Robert Taylor",
    address: "555 Elegant Road, Highend Heights, CA 94105",
    status: "active",
    productsCount: 12,
    revenue: 187500.00,
    createdAt: "2023-05-17T16:20:00.000Z"
  }
];

export const useVendorStore = create<VendorStore>((set) => ({
  vendors: [],
  vendorsStatus: 'idle',
  fetchVendors: async () => {
    // Simulate API call
    set({ vendorsStatus: 'loading' });
    
    // In a real app, this would be an API call
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ vendors: mockVendors, vendorsStatus: 'loaded' });
    } catch (error) {
      console.error('Error fetching vendors:', error);
      set({ vendorsStatus: 'error' });
    }
  }
}));
