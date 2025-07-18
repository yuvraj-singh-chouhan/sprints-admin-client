import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, Customer } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  ArrowLeft, 
  Edit, 
  Ban, 
  Trash2, 
  User, 
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Activity,
  CreditCard,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import CustomerEditDialog from '@/components/customers/CustomerEditDialog';
import CustomerDeleteDialog from '@/components/customers/CustomerDeleteDialog';
import ContactInfoCard from '@/components/shared/ContactInfoCard';
import StatsCard from '@/components/shared/StatsCard';

const CustomerDetailsPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { customers, customersStatus, fetchCustomers } = useStore();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (customersStatus !== 'success') {
      fetchCustomers();
    }
  }, [fetchCustomers, customersStatus]);

  useEffect(() => {
    if (customers.length > 0 && customerId) {
      const foundCustomer = customers.find(c => c.id === customerId);
      if (foundCustomer) {
        setCustomer(foundCustomer);
      } else {
        toast.error("Customer not found");
        navigate("/customers");
      }
    }
  }, [customers, customerId, navigate]);

  const toggleCustomerStatus = async () => {
    if (!customer) return;

    try {
      const newStatus = customer.status === 'active' ? 'banned' : 'active';
      
      useStore.setState({
        customers: customers.map(c => 
          c.id === customer.id ? { ...c, status: newStatus } : c
        )
      });
      
      setCustomer({...customer, status: newStatus});
      toast.success(`Customer ${customer.name} ${newStatus === 'active' ? 'activated' : 'banned'} successfully!`);
    } catch (error) {
      toast.error('Failed to update customer status');
      console.error('Error updating customer status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCustomerTrend = (orders: number) => {
    // Mock trend calculation - in real app this would come from API
    const trend = Math.floor(Math.random() * 20) - 10;
    return {
      value: Math.abs(trend),
      isPositive: trend >= 0
    };
  };

  const getSpendingTrend = (totalSpent: number) => {
    // Mock trend calculation
    const trend = Math.floor(Math.random() * 30) - 15;
    return {
      value: Math.abs(trend),
      isPositive: trend >= 0
    };
  };

  const getAverageOrderValue = (totalSpent: number, orders: number) => {
    return orders > 0 ? (totalSpent / orders) : 0;
  };

  if (customersStatus === 'loading') {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate("/customers")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
        </Button>
        <div className="text-center py-12">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Customer not found</p>
          <p className="text-muted-foreground">The customer you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const averageOrderValue = getAverageOrderValue(customer.totalSpent, customer.orders);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{customer.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-8 w-8 text-admin-primary" />
              {customer.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              Member since {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Badge 
            variant={customer.status === 'active' ? 'default' : 'destructive'}
            className="px-4 py-2 font-medium"
          >
            <Activity className="h-3 w-3 mr-1" />
            {customer.status}
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="hover:bg-admin-primary/10 transition-colors"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCustomerStatus}
              className={cn(
                "transition-colors",
                customer.status === 'active' 
                  ? "hover:bg-red-50 hover:text-red-600" 
                  : "hover:bg-green-50 hover:text-green-600"
              )}
            >
              <Ban className="h-4 w-4 mr-1" />
              {customer.status === 'active' ? 'Ban' : 'Activate'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={customer.orders}
          subtitle="Lifetime orders"
          icon={<ShoppingCart className="h-5 w-5" />}
          trend={getCustomerTrend(customer.orders)}
          color="blue"
        />
        <StatsCard
          title="Total Spent"
          value={`$${customer.totalSpent.toFixed(2)}`}
          subtitle="Lifetime value"
          icon={<DollarSign className="h-5 w-5" />}
          trend={getSpendingTrend(customer.totalSpent)}
          color="green"
        />
        <StatsCard
          title="Average Order"
          value={`$${averageOrderValue.toFixed(2)}`}
          subtitle="Per order value"
          icon={<TrendingUp className="h-5 w-5" />}
          color="purple"
        />
        <StatsCard
          title="Customer Rating"
          value="4.8"
          subtitle="Based on reviews"
          icon={<Star className="h-5 w-5" />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <ContactInfoCard
          title="Customer Information"
          name={customer.name}
          email={customer.email}
          phone={customer.phone}
          address={customer.address}
          status={customer.status}
          createdAt={customer.createdAt}
          icon={<User className="h-5 w-5 text-admin-primary" />}
          statusVariant={customer.status === 'active' ? 'default' : 'destructive'}
        />

        {/* Activity Timeline */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-admin-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock activity data - in real app this would come from API */}
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Order completed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  $129.99
                </Badge>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Payment processed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Account updated</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
                <Edit className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Order placed</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
                <ShoppingCart className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="text-center">
              <Button variant="outline" size="sm" className="text-sm">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-admin-primary" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Order history integration coming soon</p>
            <p className="text-sm">This will show the customer's recent orders and purchase history</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CustomerEditDialog
        customer={customer}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <CustomerDeleteDialog
        customer={customer}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
};

export default CustomerDetailsPage;
