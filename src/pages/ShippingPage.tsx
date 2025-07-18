
import { useState } from 'react';
import { 
  Truck, 
  Search, 
  Plus, 
  Package, 
  MapPin, 
  Clock,
  Eye,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from '@/components/shared/StatsCard';

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
  const navigate = useNavigate();
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

  // Calculate aggregate stats
  const totalShipments = shipments.length;
  const inTransitShipments = shipments.filter(s => s.status === 'in_transit').length;
  const deliveredShipments = shipments.filter(s => s.status === 'delivered').length;
  const activeCarriers = carriers.filter(c => c.status === 'active').length;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shipping</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-2">
          <Truck className="h-8 w-8 text-admin-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipping</h1>
            <p className="text-muted-foreground">Manage shipments, carriers, and shipping methods</p>
          </div>
        </div>
        <Button className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Create Shipment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Shipments"
          value={totalShipments}
          subtitle="All shipments"
          icon={<Package className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard
          title="In Transit"
          value={inTransitShipments}
          subtitle="Currently shipping"
          icon={<Truck className="h-5 w-5" />}
          color="amber"
        />
        <StatsCard
          title="Delivered"
          value={deliveredShipments}
          subtitle="Successfully delivered"
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <StatsCard
          title="Active Carriers"
          value={activeCarriers}
          subtitle="Available carriers"
          icon={<Globe className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="shipments" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="shipments" className="flex items-center gap-2">
            <Package className="h-4 w-4" /> Shipments
          </TabsTrigger>
          <TabsTrigger value="carriers" className="flex items-center gap-2">
            <Truck className="h-4 w-4" /> Carriers
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Shipping Methods
          </TabsTrigger>
        </TabsList>

        {/* Filters and search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center mt-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={
                activeTab === 'shipments' ? "Search shipments..." : 
                activeTab === 'carriers' ? "Search carriers..." : 
                "Search shipping methods..."
              } 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {activeTab === 'shipments' && (
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ShipmentStatus | 'all')}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Content for each tab */}
        <TabsContent value="shipments" className="mt-4">
          <ShipmentsTab 
            shipments={filteredShipments} 
            navigate={navigate}
            getInitials={getInitials}
          />
        </TabsContent>

        <TabsContent value="carriers" className="mt-4">
          <CarriersTab 
            carriers={filteredCarriers} 
            getInitials={getInitials}
          />
        </TabsContent>

        <TabsContent value="methods" className="mt-4">
          <ShippingMethodsTab 
            methods={filteredMethods}
            formatCurrency={formatCurrency}
            getInitials={getInitials}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Shipments Tab Component
function ShipmentsTab({ 
  shipments, 
  navigate,
  getInitials 
}: { 
  shipments: any[];
  navigate: (path: string) => void;
  getInitials: (name: string) => string;
}) {
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
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Shipment ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead>Tracking</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No shipments found</p>
                  <p className="text-muted-foreground">Shipments will appear here once created</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            shipments.map((shipment) => (
              <TableRow 
                key={shipment.id} 
                className="hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/orders/${shipment.orderId}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-admin-primary font-mono">{shipment.id}</span>
                    <Eye className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-semibold text-xs">
                        {getInitials(shipment.customer)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{shipment.customer}</div>
                      <Link 
                        to={`/orders/${shipment.orderId}`} 
                        className="text-sm text-admin-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {shipment.orderId}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs">
                        {getInitials(shipment.carrier)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{shipment.carrier}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {shipment.trackingNumber}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{shipment.destination}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("font-normal capitalize", getStatusBadgeStyle(shipment.status as ShipmentStatus))}
                  >
                    {shipment.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/${shipment.orderId}`);
                    }}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Carriers Tab Component
function CarriersTab({ 
  carriers,
  getInitials 
}: { 
  carriers: any[];
  getInitials: (name: string) => string;
}) {
  return (
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Carrier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carriers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No carriers found</p>
                  <p className="text-muted-foreground">Add carriers to start shipping</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            carriers.map((carrier) => (
              <TableRow key={carrier.id} className="hover:bg-muted/20 transition-colors">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-semibold">
                        {getInitials(carrier.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{carrier.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">{carrier.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={carrier.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {carrier.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Shipping Methods Tab Component
function ShippingMethodsTab({ 
  methods,
  formatCurrency,
  getInitials 
}: { 
  methods: any[];
  formatCurrency: (amount: number) => string;
  getInitials: (name: string) => string;
}) {
  return (
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Delivery Time</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {methods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No shipping methods found</p>
                  <p className="text-muted-foreground">Configure shipping methods for your carriers</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            methods.map((method) => (
              <TableRow key={method.id} className="hover:bg-muted/20 transition-colors">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{method.name}</div>
                    <div className="text-sm text-muted-foreground font-mono">{method.id}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(method.price)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {method.deliveryTime}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs">
                        {getInitials(method.carrier)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{method.carrier}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
