
import { useState } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  Package, 
  MapPin, 
  Clock,
  ArrowDownUp,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for shipping carriers
const carriers = [
  { id: 'c1', name: 'FedEx', status: 'active' },
  { id: 'c2', name: 'UPS', status: 'active' },
  { id: 'c3', name: 'USPS', status: 'active' },
  { id: 'c4', name: 'DHL', status: 'inactive' },
];

// Mock data for shipping methods
const shippingMethods = [
  { id: 'sm1', name: 'Standard Shipping', price: 5.99, deliveryTime: '3-5 days', carrier: 'FedEx' },
  { id: 'sm2', name: 'Express Shipping', price: 12.99, deliveryTime: '1-2 days', carrier: 'FedEx' },
  { id: 'sm3', name: 'Next Day Air', price: 19.99, deliveryTime: '1 day', carrier: 'UPS' },
  { id: 'sm4', name: 'Ground', price: 4.99, deliveryTime: '5-7 days', carrier: 'USPS' },
  { id: 'sm5', name: 'International Economy', price: 24.99, deliveryTime: '7-14 days', carrier: 'DHL' },
];

// Mock data for shipments
const shipments = [
  { 
    id: 'ship1', 
    orderId: 'ORD-1234', 
    customer: 'John Doe', 
    carrier: 'FedEx',
    trackingNumber: 'FDX123456789',
    status: 'in_transit',
    shippedDate: '2025-04-28',
    estimatedDelivery: '2025-05-01',
    destination: 'New York, NY'
  },
  { 
    id: 'ship2', 
    orderId: 'ORD-2345', 
    customer: 'Jane Smith', 
    carrier: 'UPS',
    trackingNumber: 'UPS987654321',
    status: 'delivered',
    shippedDate: '2025-04-25',
    estimatedDelivery: '2025-04-27',
    destination: 'Los Angeles, CA'
  },
  { 
    id: 'ship3', 
    orderId: 'ORD-3456', 
    customer: 'Robert Johnson', 
    carrier: 'USPS',
    trackingNumber: 'USPS45678901',
    status: 'pending',
    shippedDate: '',
    estimatedDelivery: '2025-05-05',
    destination: 'Chicago, IL'
  },
  { 
    id: 'ship4', 
    orderId: 'ORD-4567', 
    customer: 'Mary Williams', 
    carrier: 'DHL',
    trackingNumber: 'DHL567890123',
    status: 'processing',
    shippedDate: '2025-04-29',
    estimatedDelivery: '2025-05-06',
    destination: 'Miami, FL'
  },
];

type ShipmentStatus = 'pending' | 'processing' | 'in_transit' | 'delivered' | 'failed';
type CarrierStatus = 'active' | 'inactive';

export default function ShippingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState('shipments');

  // Filter shipments based on search query and status filter
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchQuery === '' || 
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter carriers based on search query
  const filteredCarriers = carriers.filter(carrier => {
    return searchQuery === '' || 
      carrier.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Filter shipping methods based on search query
  const filteredMethods = shippingMethods.filter(method => {
    return searchQuery === '' || 
      method.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      method.carrier.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Truck className="mr-2 text-admin-primary" /> Shipping
          </h1>
          <p className="text-muted-foreground">Manage shipments, carriers, and shipping methods.</p>
        </div>
        <Button className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus size={16} className="mr-2" /> Create Shipment
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="shipments" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="shipments" className="flex items-center gap-2">
            <Package size={16} /> Shipments
          </TabsTrigger>
          <TabsTrigger value="carriers" className="flex items-center gap-2">
            <Truck size={16} /> Carriers
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <Clock size={16} /> Shipping Methods
          </TabsTrigger>
        </TabsList>

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={
                activeTab === 'shipments' ? "Search shipments..." : 
                activeTab === 'carriers' ? "Search carriers..." : 
                "Search shipping methods..."
              } 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {activeTab === 'shipments' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter size={16} className="mr-2" />
                  {statusFilter === 'all' ? 'All Statuses' : statusFilter.replace('_', ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('processing')}>
                  Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('in_transit')}>
                  In Transit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('delivered')}>
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                  Failed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="outline" className="flex items-center">
            <ArrowDownUp size={16} className="mr-2" /> Sort
          </Button>
        </div>

        {/* Content for each tab */}
        <TabsContent value="shipments" className="mt-4">
          <ShipmentsTab shipments={filteredShipments} />
        </TabsContent>

        <TabsContent value="carriers" className="mt-4">
          <CarriersTab carriers={filteredCarriers} />
        </TabsContent>

        <TabsContent value="methods" className="mt-4">
          <ShippingMethodsTab methods={filteredMethods} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Shipments Tab Component
function ShipmentsTab({ shipments }: { shipments: any[] }) {
  const getStatusBadgeStyle = (status: ShipmentStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No shipments found.
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((shipment) => (
                  <TableRow key={shipment.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {shipment.id}
                    </TableCell>
                    <TableCell>
                      <Link to={`/orders/${shipment.orderId}`} className="text-blue-600 hover:underline">
                        {shipment.orderId}
                      </Link>
                    </TableCell>
                    <TableCell>{shipment.customer}</TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{shipment.trackingNumber}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1 text-gray-500" />
                        {shipment.destination}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("font-normal", getStatusBadgeStyle(shipment.status as ShipmentStatus))}
                      >
                        {shipment.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Carriers Tab Component
function CarriersTab({ carriers }: { carriers: any[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Carrier Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carriers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No carriers found.
                  </TableCell>
                </TableRow>
              ) : (
                carriers.map((carrier) => (
                  <TableRow key={carrier.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {carrier.id}
                    </TableCell>
                    <TableCell>{carrier.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "font-normal",
                          carrier.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        )}
                      >
                        {carrier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Shipping Methods Tab Component
function ShippingMethodsTab({ methods }: { methods: any[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Method Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Delivery Time</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No shipping methods found.
                  </TableCell>
                </TableRow>
              ) : (
                methods.map((method) => (
                  <TableRow key={method.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {method.id}
                    </TableCell>
                    <TableCell>{method.name}</TableCell>
                    <TableCell>${method.price.toFixed(2)}</TableCell>
                    <TableCell>{method.deliveryTime}</TableCell>
                    <TableCell>{method.carrier}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
