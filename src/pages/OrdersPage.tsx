
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, type OrderStatus } from '@/lib/store';
import { ShoppingCart, Search, Filter, Eye } from 'lucide-react';
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
import { type Order } from '@/lib/store';
import { toast } from 'sonner';

export default function OrdersPage() {
  const { orders, ordersStatus, fetchOrders, updateOrderStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

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

  // Handle updating order status
  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    toast.success(`Order ${orderId} status updated to ${status}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <ShoppingCart className="mr-2 text-admin-primary" /> Orders
          </h1>
          <p className="text-muted-foreground">Manage customer orders.</p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders by ID, customer name, or email..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              {statusFilter === 'all' ? 'All Statuses' : statusFilter}
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
            <DropdownMenuItem onClick={() => setStatusFilter('shipped')}>
              Shipped
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('delivered')}>
              Delivered
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Orders table */}
      <Card>
        <CardContent className="p-0">
          {ordersStatus === 'loading' ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <OrderRow 
                        key={order.id} 
                        order={order} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderRow({ order, onStatusUpdate }: { 
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
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

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">
        <Link
          to={`/orders/${order.id}`}
          className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
        >
          {order.id}
          <Eye className="ml-1 h-3 w-3" />
        </Link>
      </TableCell>
      <TableCell>
        <div>{order.customer.name}</div>
        <div className="text-xs text-muted-foreground">{order.customer.email}</div>
      </TableCell>
      <TableCell>
        {formatDate(order.createdAt)}
      </TableCell>
      <TableCell>
        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
      </TableCell>
      <TableCell>
        ${order.totalAmount.toFixed(2)}
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={cn("font-normal", getStatusBadgeStyle(order.status))}
        >
          {order.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Update Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(order.id, 'pending')}
                disabled={order.status === 'pending'}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(order.id, 'processing')}
                disabled={order.status === 'processing'}
              >
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(order.id, 'shipped')}
                disabled={order.status === 'shipped'}
              >
                Shipped
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(order.id, 'delivered')}
                disabled={order.status === 'delivered'}
              >
                Delivered
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(order.id, 'cancelled')}
                disabled={order.status === 'cancelled'}
              >
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to={`/orders/${order.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Details</span>
            </Button>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
