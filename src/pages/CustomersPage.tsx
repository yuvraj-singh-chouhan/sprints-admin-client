import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Customer } from '@/lib/store';
import { 
  User, 
  Plus,
  Users,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import CustomerEditDialog from '@/components/customers/CustomerEditDialog';
import CustomerDeleteDialog from '@/components/customers/CustomerDeleteDialog';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import AvatarWithInitials from '@/components/shared/AvatarWithInitials';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatsGrid from '@/components/shared/StatsGrid';
import StatusBadge from '@/components/shared/StatusBadge';
import TableActions from '@/components/shared/TableActions';
import { formatCurrency } from '@/lib/utils';

const CustomersPage = () => {
  const { customers, customersStatus, fetchCustomers } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Items per page
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate aggregate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0);

  const toggleCustomerStatus = async (customer: Customer) => {
    try {
      const newStatus = customer.status === 'active' ? 'banned' : 'active';
      
      useStore.setState({
        customers: customers.map(c => 
          c.id === customer.id ? { ...c, status: newStatus } : c
        )
      });
      
      toast.success(`Customer ${customer.name} ${newStatus === 'active' ? 'activated' : 'banned'} successfully!`);
    } catch (error) {
      toast.error('Failed to update customer status');
      console.error('Error updating customer status:', error);
    }
  };

  // Prepare stats data
  const statsData = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: <Users className="h-5 w-5" />,
      color: "blue" as const,
      subtitle: "Registered users"
    },
    {
      title: "Active Customers", 
      value: activeCustomers,
      icon: <User className="h-5 w-5" />,
      color: "green" as const,
      subtitle: "Currently active"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: <DollarSign className="h-5 w-5" />,
      color: "purple" as const,
      subtitle: "From all customers"
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "amber" as const,
      subtitle: "All time orders"
    }
  ];

  // Prepare table columns
  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (customer: Customer) => (
        <div className="flex items-center space-x-3">
          <AvatarWithInitials name={customer.name} size="lg" />
          <div>
            <div className="font-medium text-gray-900">{customer.name}</div>
            <div className="text-sm text-muted-foreground">{customer.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact Info', 
      render: (customer: Customer) => (
        <div>
          <div className="font-medium">{customer.phone}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
            {customer.address}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (customer: Customer) => (
        <StatusBadge status={customer.status} />
      )
    },
    {
      key: 'orders',
      header: 'Orders',
      render: (customer: Customer) => (
        <div className="text-center">
          <Badge variant="outline" className="font-mono">
            {customer.orders}
          </Badge>
        </div>
      )
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      render: (customer: Customer) => (
        <div className="text-right font-mono">
          {formatCurrency(customer.totalSpent)}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (customer: Customer) => (
        <TableActions
          actions={[
            {
              type: 'edit',
              onClick: () => {
                setSelectedCustomer(customer);
                setIsEditOpen(true);
              },
              label: 'Edit Customer'
            },
            {
              type: 'ban',
              onClick: () => toggleCustomerStatus(customer),
              label: customer.status === 'active' ? 'Ban Customer' : 'Activate Customer'
            },
            {
              type: 'delete',
              onClick: () => {
                setSelectedCustomer(customer);
                setIsDeleteOpen(true);
              },
              label: 'Delete Customer'
            }
          ]}
        />
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Customers"
        description="Manage customer accounts and relationships"
        icon={<Users className="h-8 w-8" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Customers" }
        ]}
        action={{
          label: "Add Customer",
          onClick: () => {/* Add customer logic */},
          icon: <Plus className="h-4 w-4" />
        }}
      />

      <StatsGrid stats={statsData} />
      
      <DataTable
        data={filteredCustomers}
        columns={columns}
        searchPlaceholder="Search customers..."
        filters={
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        }
        emptyState={{
          icon: <Users className="h-12 w-12" />,
          title: "No customers found",
          description: searchTerm || statusFilter !== 'all' 
            ? 'Try adjusting your search or filters' 
            : 'Add your first customer to get started'
        }}
        onRowClick={(customer) => navigate(`/customers/${customer.id}`)}
        loading={customersStatus === 'loading'}
        itemsPerPage={itemsPerPage}
      />

      {/* Dialogs */}
      <CustomerEditDialog
        customer={selectedCustomer}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <CustomerDeleteDialog
        customer={selectedCustomer}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
};

export default CustomersPage;
