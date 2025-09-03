
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, type OrderStatus } from '@/lib/store';
import { 
  ShoppingCart, 
  Plus, 
  Eye,
  TrendingUp,
  DollarSign,
  Package,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { type Order } from '@/lib/store';
import { toast } from 'sonner';
import AvatarWithInitials from '@/components/shared/AvatarWithInitials';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatsGrid from '@/components/shared/StatsGrid';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatTableDate } from '@/lib/utils';
import { TableCell } from '@/components/ui/table';

export default function OrdersPage() {
  const { orders, ordersStatus, fetchOrders, updateOrderStatus } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
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

  // Calculate aggregate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Handle updating order status
  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    toast.success(`Order ${orderId} status updated to ${status}`);
  };

  // Prepare stats data
  const statsData = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "blue" as const,
      subtitle: "All orders"
    },
    {
      title: "Total Revenue", 
      value: formatCurrency(totalRevenue),
      icon: <DollarSign className="h-5 w-5" />,
      color: "green" as const,
      subtitle: "From all orders"
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: <Clock className="h-5 w-5" />,
      color: "amber" as const,
      subtitle: "Awaiting processing"
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      icon: <Package className="h-5 w-5" />,
      color: "purple" as const,
      subtitle: "Successfully delivered"
    }
  ];

  // Prepare table columns
  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (order: Order) => (
        <div className="flex items-center gap-2">
          <span className="text-admin-primary font-mono">{order.id}</span>
          <Eye className="h-3 w-3 text-muted-foreground" />
        </div>
      )
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order: Order) => (
        <div className="flex items-center space-x-3">
          <AvatarWithInitials name={order.customer.name} size="md" />
          <div>
            <div className="font-medium text-gray-900">{order.customer.name}</div>
            <div className="text-sm text-muted-foreground">{order.customer.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (order: Order) => (
        <div className="text-sm">{formatTableDate(order.createdAt)}</div>
      )
    },
    {
      key: 'items',
      header: 'Items',
      render: (order: Order) => (
        <div className="text-center">
          <Badge variant="outline" className="font-mono">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (order: Order) => (
        <div className="text-right font-mono">
          {formatCurrency(order.totalAmount)}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (order: Order) => <StatusBadge status={order.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order: Order) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(`/orders/${order.id}`)}
          title="View Order"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Orders"
        description="Manage customer orders and fulfillment"
        icon={<ShoppingCart className="h-8 w-8" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Orders" }
        ]}
        action={{
          label: "Create Order",
          onClick: () => {/* Create order logic */},
          icon: <Plus className="h-4 w-4" />
        }}
      />

      <StatsGrid stats={statsData} />

      <DataTable
        data={filteredOrders}
        columns={columns}
        searchPlaceholder="Search orders..."
        filters={
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
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
        }
        emptyState={{
          icon: <ShoppingCart className="h-12 w-12" />,
          title: "No orders found",
          description: searchQuery || statusFilter !== 'all' 
            ? 'Try adjusting your search or filters' 
            : 'Orders will appear here once customers start purchasing'
        }}
        onRowClick={(order) => navigate(`/orders/${order.id}`)}
        loading={ordersStatus === 'loading'}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}