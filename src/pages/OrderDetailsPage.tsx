
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, type Order, type OrderStatus } from '@/lib/store';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  PackageCheck, 
  Truck, 
  Ban, 
  Clock, 
  CheckCircle, 
  User, 
  Mail, 
  MapPin, 
  Package,
  Calendar,
  CreditCard,
  ShoppingBag,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Order Status Timeline Component
const OrderStatusTimeline = ({ 
  currentStatus, 
  onStatusUpdate 
}: { 
  currentStatus: OrderStatus; 
  onStatusUpdate: (status: OrderStatus) => void;
}) => {
  const statusFlow: { status: OrderStatus; label: string; icon: React.ReactNode; description: string }[] = [
    {
      status: 'pending',
      label: 'Order Placed',
      icon: <Clock className="h-4 w-4" />,
      description: 'Order received and pending'
    },
    {
      status: 'processing',
      label: 'Processing',
      icon: <PackageCheck className="h-4 w-4" />,
      description: 'Order is being prepared'
    },
    {
      status: 'shipped',
      label: 'Shipped',
      icon: <Truck className="h-4 w-4" />,
      description: 'Order is on the way'
    },
    {
      status: 'delivered',
      label: 'Delivered',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Order has been delivered'
    }
  ];

  const currentIndex = statusFlow.findIndex(step => step.status === currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Order Progress</h3>
        {!isCancelled && currentStatus !== 'delivered' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const nextIndex = Math.min(currentIndex + 1, statusFlow.length - 1);
              if (nextIndex > currentIndex) {
                onStatusUpdate(statusFlow[nextIndex].status);
              }
            }}
            className="text-sm"
          >
            <Edit className="h-3 w-3 mr-1" />
            Advance Status
          </Button>
        )}
      </div>

      {isCancelled ? (
        <div className="flex items-center space-x-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Ban className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div>
            <p className="font-medium text-red-900">Order Cancelled</p>
            <p className="text-sm text-red-700">This order has been cancelled</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {statusFlow.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;

            return (
              <div key={step.status} className="flex items-center space-x-4">
                <div className="relative">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out",
                      isCompleted
                        ? "bg-admin-primary text-white scale-110 shadow-lg"
                        : isCurrent
                        ? "bg-admin-primary/20 text-admin-primary border-2 border-admin-primary animate-pulse"
                        : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                    )}
                  >
                    {step.icon}
                  </div>
                  {index < statusFlow.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-8 left-4 w-0.5 h-8 transition-all duration-700 ease-in-out",
                        isCompleted ? "bg-admin-primary" : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      isCurrent && "transform translate-x-1"
                    )}
                  >
                    <p
                      className={cn(
                        "font-medium transition-colors duration-300",
                        isCompleted || isCurrent
                          ? "text-gray-900"
                          : "text-gray-500"
                      )}
                    >
                      {step.label}
                    </p>
                    <p
                      className={cn(
                        "text-sm transition-colors duration-300",
                        isCompleted || isCurrent
                          ? "text-gray-600"
                          : "text-gray-400"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle className="h-5 w-5 text-green-500 animate-in fade-in duration-300" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Status Update Buttons */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {statusFlow.map((step) => (
            <Button
              key={step.status}
              size="sm"
              variant={currentStatus === step.status ? "default" : "outline"}
              onClick={() => onStatusUpdate(step.status)}
              disabled={currentStatus === step.status || isCancelled}
              className={cn(
                "text-xs transition-all duration-200",
                currentStatus === step.status && "bg-admin-primary hover:bg-admin-primary-hover"
              )}
            >
              {step.icon}
              <span className="ml-1">{step.label}</span>
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusUpdate('cancelled')}
            disabled={isCancelled || currentStatus === 'delivered'}
            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
          >
            <Ban className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, ordersStatus, fetchOrders, updateOrderStatus } = useStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (ordersStatus === 'idle') {
      fetchOrders();
    }
  }, [ordersStatus, fetchOrders]);

  useEffect(() => {
    if (orders.length > 0 && orderId) {
      const foundOrder = orders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast.error('Order not found');
        navigate('/orders');
      }
    }
  }, [orders, orderId, navigate]);

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (order) {
      await updateOrderStatus(order.id, status);
      toast.success(`Order status updated to ${status}`);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      refunded: "bg-blue-100 text-blue-800 border-blue-200",
      failed: "bg-red-100 text-red-800 border-red-200"
    };
    return styles[status as keyof typeof styles] || styles.failed;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getCustomerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (ordersStatus === 'loading') {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate("/orders")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Order not found</p>
          <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{order.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-admin-primary" />
              Order {order.id}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Badge 
            variant="outline" 
            className={cn("px-4 py-2 font-medium text-sm", getPaymentStatusBadge(order.paymentStatus))}
          >
            <CreditCard className="h-3 w-3 mr-1" />
            Payment {order.paymentStatus}
          </Badge>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-admin-primary">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Timeline */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-admin-primary" />
              Order Status & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusTimeline 
              currentStatus={order.status} 
              onStatusUpdate={handleStatusUpdate}
            />
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-admin-primary" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-semibold">
                    {getCustomerInitials(order.customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {order.customer.email}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Shipping Address
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="whitespace-pre-line text-sm">{order.shippingAddress}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-admin-primary" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-admin-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-admin-primary">{order.items.length}</p>
                  <p className="text-sm text-muted-foreground">Items</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">{order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{formatDate(order.updatedAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-admin-primary" />
            Order Items ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="py-4 px-6 text-left font-medium text-muted-foreground">Product</th>
                    <th className="py-4 px-6 text-left font-medium text-muted-foreground">Variant</th>
                    <th className="py-4 px-6 text-center font-medium text-muted-foreground">Quantity</th>
                    <th className="py-4 px-6 text-right font-medium text-muted-foreground">Unit Price</th>
                    <th className="py-4 px-6 text-right font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {item.variant.size && item.variant.color ? (
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              Size: {item.variant.size}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Color: {item.variant.color}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No variant</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Badge variant="secondary" className="font-mono">
                          {item.quantity}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right font-mono">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right font-bold font-mono">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-admin-primary/20 bg-admin-primary/5">
                    <td colSpan={4} className="py-4 px-6 text-right font-semibold text-gray-900">
                      Total Amount:
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-xl text-admin-primary font-mono">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
