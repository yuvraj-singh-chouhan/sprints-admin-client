
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { 
  Package, 
  Search, 
  Plus, 
  ExternalLink,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle
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
import { type Product } from '@/lib/store';
import StatsCard from '@/components/shared/StatsCard';

export default function ProductsPage() {
  const { products, productsStatus, fetchProducts } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (productsStatus === 'idle') {
      fetchProducts();
    }
  }, [productsStatus, fetchProducts]);

  // Filter products based on search query and category filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Calculate aggregate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.inventory), 0);
  const lowStockProducts = products.filter(product => product.inventory <= 5).length;
  const inStockProducts = products.filter(product => product.inventory > 5).length;

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
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8 text-admin-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory and catalog</p>
          </div>
        </div>
        <Link to="/products/add">
          <Button className="bg-admin-primary hover:bg-admin-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          subtitle="In catalog"
          icon={<Package className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard
          title="Inventory Value"
          value={formatCurrency(totalValue)}
          subtitle="Total stock value"
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockProducts}
          subtitle="Need restocking"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="amber"
        />
        <StatsCard
          title="In Stock Items"
          value={inStockProducts}
          subtitle="Well stocked"
          icon={<CheckCircle className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Filters and search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products table */}
      {productsStatus === 'loading' ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Inventory</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <Package className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-muted-foreground">
                          {searchQuery || categoryFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Add your first product to get started'
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <ProductRow 
                      key={product.id} 
                      product={product} 
                      onNavigate={() => navigate(`/products/${product.id}`)}
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

function ProductRow({ 
  product, 
  onNavigate,
  getInitials 
}: { 
  product: Product;
  onNavigate: () => void;
  getInitials: (name: string) => string;
}) {
  const getInventoryStatus = (inventory: number) => {
    if (inventory <= 5) return { 
      label: 'Low Stock', 
      class: 'bg-red-100 text-red-800 border-red-200',
      variant: 'destructive' as const
    };
    if (inventory <= 20) return { 
      label: 'Limited', 
      class: 'bg-amber-100 text-amber-800 border-amber-200',
      variant: 'secondary' as const
    };
    return { 
      label: 'In Stock', 
      class: 'bg-green-100 text-green-800 border-green-200',
      variant: 'default' as const
    };
  };

  const inventoryStatus = getInventoryStatus(product.inventory);

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
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-muted/50 overflow-hidden flex items-center justify-center">
            {product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-muted-foreground font-mono">{product.id}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-normal capitalize">
          {product.category}
        </Badge>
      </TableCell>
      <TableCell className="text-right font-mono">
        {formatCurrency(product.price)}
      </TableCell>
      <TableCell className="text-center">
        <div className="space-y-1">
          <Badge variant="outline" className="font-mono">
            {product.inventory}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-semibold text-xs">
              {getInitials(product.vendor)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{product.vendor}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant={inventoryStatus.variant}
          className="font-normal"
        >
          {inventoryStatus.label}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
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
          <ExternalLink className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
