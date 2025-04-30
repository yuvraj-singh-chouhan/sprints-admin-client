
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore, Customer } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Edit, Ban, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerEditDialog from '@/components/customers/CustomerEditDialog';
import CustomerDeleteDialog from '@/components/customers/CustomerDeleteDialog';

const CustomerDetailsPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { customers, customersStatus, fetchCustomers } = useStore();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (customersStatus !== 'loaded') {
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
      // In a real application, this would call an API
      const newStatus = customer.status === 'active' ? 'banned' : 'active';
      
      // Update local state for instant feedback
      useStore.setState({
        customers: customers.map(c => 
          c.id === customer.id ? { ...c, status: newStatus } : c
        )
      });
      
      // Update the local customer state
      setCustomer({...customer, status: newStatus});
      
      toast.success(`Customer ${customer.name} ${newStatus === 'active' ? 'activated' : 'banned'} successfully!`);
    } catch (error) {
      toast.error('Failed to update customer status');
      console.error('Error updating customer status:', error);
    }
  };

  if (customersStatus === 'loading') {
    return (
      <div className="p-6">
        <p>Loading customer details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <p>Customer not found</p>
        <Button onClick={() => navigate("/customers")} className="mt-4">
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/customers">Customers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{customer.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            customer.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {customer.status}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleCustomerStatus}
            className="flex items-center gap-1"
          >
            <Ban className="h-4 w-4" />
            {customer.status === 'active' ? 'Ban' : 'Activate'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{customer.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p>{formatDate(customer.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{customer.orders}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer edit dialog */}
      <CustomerEditDialog
        customer={customer}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Customer delete dialog */}
      <CustomerDeleteDialog
        customer={customer}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
};

export default CustomerDetailsPage;
