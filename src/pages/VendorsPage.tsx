import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorStore, Vendor } from '@/lib/vendorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Eye, 
  Search, 
  Plus, 
  Building, 
  TrendingUp,
  Users,
  DollarSign,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatsCard from '@/components/shared/StatsCard';

const VendorsPage = () => {
  const { vendors, vendorsStatus, fetchVendors } = useVendorStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage);

  // Calculate aggregate stats
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const totalRevenue = vendors.reduce((sum, v) => sum + v.revenue, 0);
  const totalProducts = vendors.reduce((sum, v) => sum + v.productsCount, 0);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
            <BreadcrumbPage>Vendors</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-2">
          <Building className="h-8 w-8 text-admin-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
            <p className="text-muted-foreground">Manage your vendor partnerships</p>
          </div>
        </div>
        <Button className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Vendors"
          value={totalVendors}
          subtitle="Registered partners"
          icon={<Building className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard
          title="Active Vendors"
          value={activeVendors}
          subtitle="Currently active"
          icon={<Users className="h-5 w-5" />}
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="From all vendors"
          icon={<DollarSign className="h-5 w-5" />}
          color="purple"
        />
        <StatsCard
          title="Total Products"
          value={totalProducts}
          subtitle="From all vendors"
          icon={<Package className="h-5 w-5" />}
          color="amber"
        />
      </div>
      
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {vendorsStatus === 'loading' ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading vendors...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <Building className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No vendors found</p>
                        <p className="text-muted-foreground">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filters' 
                            : 'Add your first vendor to get started'
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVendors.map((vendor) => (
                    <TableRow 
                      key={vendor.id} 
                      className="hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/vendors/${vendor.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-semibold">
                              {getInitials(vendor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{vendor.name}</div>
                            <div className="text-sm text-muted-foreground">{vendor.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vendor.contactPerson}</div>
                          <div className="text-sm text-muted-foreground">{vendor.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={vendor.status === 'active' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {vendor.productsCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(vendor.revenue)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/vendors/${vendor.id}`);
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
};

export default VendorsPage;
