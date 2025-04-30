
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { ArrowLeft, PackageCheck, Truck, Ban, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

  // Handle updating order status
  const handleStatusUpdate = async (status: OrderStatus) => {
    if (order) {
      await updateOrderStatus(order.id, status);
      toast.success(`Order status updated to ${status}`);
    }
  };

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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'processing':
        return <PackageCheck className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <Ban className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Format date for display
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

  if (ordersStatus === 'loading') {
    return (
      <div className="p-6 flex justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate("/orders")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              Order {order.id}
            </h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn("px-3 py-1 font-medium text-sm", getStatusBadgeStyle(order.status))}
          >
            <span className="flex items-center gap-1">
              {getStatusIcon(order.status)} {order.status}
            </span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{order.customer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
                <p className="whitespace-pre-line">{order.shippingAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                <Badge 
                  variant="outline" 
                  className={cn("mt-1 px-3 py-1 font-medium", getStatusBadgeStyle(order.status))}
                >
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                <Badge 
                  variant="outline" 
                  className={cn("mt-1 px-3 py-1 font-medium", 
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                    order.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    order.paymentStatus === 'refunded' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  )}
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p>{formatDate(order.updatedAt)}</p>
              </div>
              <div className="pt-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={order.status === 'pending'}
                  >
                    Pending
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                    onClick={() => handleStatusUpdate('processing')}
                    disabled={order.status === 'processing'}
                  >
                    Processing
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
                    onClick={() => handleStatusUpdate('shipped')}
                    disabled={order.status === 'shipped'}
                  >
                    Shipped
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                    onClick={() => handleStatusUpdate('delivered')}
                    disabled={order.status === 'delivered'}
                  >
                    Delivered
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={order.status === 'cancelled'}
                  >
                    Cancelled
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p>{order.items.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">Product</th>
                  <th className="py-3 px-4 text-left font-medium">Variant</th>
                  <th className="py-3 px-4 text-center font-medium">Quantity</th>
                  <th className="py-3 px-4 text-right font-medium">Price</th>
                  <th className="py-3 px-4 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="py-3 px-4">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {item.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      {item.variant.size && item.variant.color ? (
                        <div className="text-sm">
                          Size: {item.variant.size}, Color: {item.variant.color}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No variant</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-border bg-muted/20">
                  <td colSpan={4} className="py-4 px-4 text-right font-medium">Total:</td>
                  <td className="py-4 px-4 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
