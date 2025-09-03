import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorStore, Vendor } from '@/lib/vendorStore';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Plus, 
  Building, 
  TrendingUp,
  Users,
  DollarSign,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import AvatarWithInitials from '@/components/shared/AvatarWithInitials';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatsGrid from '@/components/shared/StatsGrid';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency } from '@/lib/utils';

const VendorsPage = () => {
  const { vendors, vendorsStatus, fetchVendors } = useVendorStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Items per page
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Filter vendors based on search term and status
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      vendor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate aggregate stats
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const totalRevenue = vendors.reduce((sum, v) => sum + v.revenue, 0);
  const totalProducts = vendors.reduce((sum, v) => sum + v.productsCount, 0);

  // Prepare stats data
  const statsData = [
    {
      title: "Total Vendors",
      value: totalVendors,
      icon: <Building className="h-5 w-5" />,
      color: "blue" as const,
      subtitle: "Registered vendors"
    },
    {
      title: "Active Vendors", 
      value: activeVendors,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "green" as const,
      subtitle: "Currently active"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: <DollarSign className="h-5 w-5" />,
      color: "purple" as const,
      subtitle: "From all vendors"
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="h-5 w-5" />,
      color: "amber" as const,
      subtitle: "Products available"
    }
  ];

  // Prepare table columns
  const columns = [
    {
      key: 'name',
      header: 'Vendor',
      render: (vendor: Vendor) => (
        <div className="flex items-center space-x-3">
          <AvatarWithInitials name={vendor.name} size="lg" />
          <div>
            <div className="font-medium text-gray-900">{vendor.name}</div>
            <div className="text-sm text-muted-foreground">{vendor.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact Person', 
      render: (vendor: Vendor) => (
        <div>
          <div className="font-medium">{vendor.contactPerson}</div>
          <div className="text-sm text-muted-foreground">{vendor.phone}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (vendor: Vendor) => (
        <StatusBadge status={vendor.status} />
      )
    },
    {
      key: 'products',
      header: 'Products',
      render: (vendor: Vendor) => (
        <div className="text-center">
          <Badge variant="outline" className="font-mono">
            {vendor.productsCount}
          </Badge>
        </div>
      )
    },
    {
      key: 'revenue',
      header: 'Revenue',
      render: (vendor: Vendor) => (
        <div className="text-right font-mono">
          {formatCurrency(vendor.revenue)}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (vendor: Vendor) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(`/vendors/${vendor.id}`)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Vendors"
        description="Manage your vendor partnerships"
        icon={<Building className="h-8 w-8" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Vendors" }
        ]}
        action={{
          label: "Add Vendor",
          onClick: () => {/* Add vendor logic */},
          icon: <Plus className="h-4 w-4" />
        }}
      />

      <StatsGrid stats={statsData} />
      
      <DataTable
        data={filteredVendors}
        columns={columns}
        searchPlaceholder="Search vendors..."
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
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        }
        emptyState={{
          icon: <Building className="h-12 w-12" />,
          title: "No vendors found",
          description: searchTerm || statusFilter !== 'all' 
            ? 'Try adjusting your search or filters' 
            : 'Add your first vendor to get started'
        }}
        onRowClick={(vendor) => navigate(`/vendors/${vendor.id}`)}
        loading={vendorsStatus === 'loading'}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default VendorsPage;
