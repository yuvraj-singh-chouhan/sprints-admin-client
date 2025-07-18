
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, type OrderStatus } from '@/lib/store';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Eye,
  TrendingUp,
  DollarSign,
  Package,
  Clock
} from 'lucide-react';
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { type Order } from '@/lib/store';
import { toast } from 'sonner';
import StatsCard from '@/components/shared/StatsCard';

export default function OrdersPage() {
  const { orders, ordersStatus, fetchOrders, updateOrderStatus } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (ordersStatus === 'idle') {
      fetchOrders();
    }
  }, [ordersStatus, fetchOrders]);

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Calculate aggregate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;

  // Handle updating order status
  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    toast.success(`Order ${orderId} status updated to ${status}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
            <BreadcrumbPage>Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-admin-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
          </div>
        </div>
        <Button className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          subtitle="All time orders"
          icon={<ShoppingCart className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="From all orders"
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders}
          subtitle="Awaiting processing"
          icon={<Clock className="h-5 w-5" />}
          color="amber"
        />
        <StatsCard
          title="Completed Orders"
          value={completedOrders}
          subtitle="Successfully delivered"
          icon={<Package className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Filters and search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders table */}
      {ordersStatus === 'loading' ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-muted-foreground">
                          {searchQuery || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filters' 
                            : 'Orders will appear here once customers start purchasing'
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <OrderRow 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={handleStatusUpdate}
                      onNavigate={() => navigate(`/orders/${order.id}`)}
                      getInitials={getInitials}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

function OrderRow({ 
  order, 
  onStatusUpdate, 
  onNavigate,
  getInitials 
}: { 
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onNavigate: () => void;
  getInitials: (name: string) => string;
}) {
  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <TableRow 
      className="hover:bg-muted/20 transition-colors cursor-pointer"
      onClick={onNavigate}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <span className="text-admin-primary font-mono">{order.id}</span>
          <Eye className="h-3 w-3 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-semibold text-xs">
              {getInitials(order.customer.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{order.customer.name}</div>
            <div className="text-sm text-muted-foreground">{order.customer.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{formatDate(order.createdAt)}</div>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="outline" className="font-mono">
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </Badge>
      </TableCell>
      <TableCell className="text-right font-mono">
        {formatCurrency(order.totalAmount)}
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={cn("font-normal capitalize", getStatusBadgeStyle(order.status))}
        >
          {order.status}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center items-center gap-2">
          <Select
            value={order.status}
            onValueChange={(value) => {
              if (value !== order.status) {
                onStatusUpdate(order.id, value as OrderStatus);
              }
            }}
          >
            <SelectTrigger 
              className="w-32 h-8 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
