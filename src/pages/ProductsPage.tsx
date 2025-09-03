
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import {
  Package,
  Plus,
  ExternalLink,
  DollarSign,
  AlertTriangle,
  CheckCircle
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
import { type Product } from '@/lib/store';
import AvatarWithInitials from '@/components/shared/AvatarWithInitials';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatsGrid from '@/components/shared/StatsGrid';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const { products, productsStatus, fetchProducts } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
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

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Calculate aggregate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.inventory), 0);
  const lowStockProducts = products.filter(product => product.inventory <= 5).length;
  const inStockProducts = products.filter(product => product.inventory > 5).length;

  // Prepare stats data
  const statsData = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="h-5 w-5" />,
      color: "blue" as const,
      subtitle: "All products"
    },
    {
      title: "Total Value",
      value: formatCurrency(totalValue),
      icon: <DollarSign className="h-5 w-5" />,
      color: "green" as const,
      subtitle: "Inventory value"
    },
    {
      title: "Low Stock",
      value: lowStockProducts,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "red" as const,
      subtitle: "≤5 items"
    },
    {
      title: "In Stock",
      value: inStockProducts,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "amber" as const,
      subtitle: ">5 items"
    }
  ];

  // Prepare table columns
  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (product: Product) => (
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
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (product: Product) => (
        <Badge variant="outline" className="font-normal capitalize">
          {product.category}
        </Badge>
      )
    },
    {
      key: 'price',
      header: 'Price',
      render: (product: Product) => (
        <div className="text-right font-mono">
          {formatCurrency(product.price)}
        </div>
      )
    },
    {
      key: 'inventory',
      header: 'Inventory',
      render: (product: Product) => (
        <div className="text-center space-y-1">
          <Badge variant="outline" className="font-mono">
            {product.inventory}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
          </div>
        </div>
      )
    },
    {
      key: 'vendor',
      header: 'Vendor',
      render: (product: Product) => (
        <div className="flex items-center space-x-2">
          <AvatarWithInitials name={product.vendor} size="sm" />
          <span className="text-sm">{product.vendor}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (product: Product) => {
        const getInventoryStatus = (inventory: number) => {
          if (inventory <= 5) return {
            status: 'Low Stock',
            variant: 'destructive' as const
          };
          if (inventory <= 20) return {
            status: 'Limited',
            variant: 'secondary' as const
          };
          return {
            status: 'In Stock',
            variant: 'default' as const
          };
        };

        const inventoryStatus = getInventoryStatus(product.inventory);

        return (
          <Badge
            variant={inventoryStatus.variant}
            className="font-normal"
          >
            {inventoryStatus.status}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product: Product) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(`/products/${product.id}`)}
          title="View Product"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Products"
        description="Manage your product inventory and catalog"
        icon={<Package className="h-8 w-8" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Products" }
        ]}
        action={{
          label: "Add Product",
          onClick: () => navigate('/products/add'),
          icon: <Plus className="h-4 w-4" />
        }}
      />

      <StatsGrid stats={statsData} />

      <DataTable
        data={filteredProducts}
        columns={columns}
        searchPlaceholder="Search products..."
        filters={
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
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
        }
        emptyState={{
          icon: <Package className="h-12 w-12" />,
          title: "No products found",
          description: searchQuery || categoryFilter !== 'all'
            ? 'Try adjusting your search or filters'
            : 'Add your first product to get started'
        }}
        onRowClick={(product) => navigate(`/products/${product.id}`)}
        loading={productsStatus === 'loading'}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
