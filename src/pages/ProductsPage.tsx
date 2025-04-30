
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Package, Search, Filter, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { type Product } from '@/lib/store';

export default function ProductsPage() {
  const { products, productsStatus, fetchProducts } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

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
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === null || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Package className="mr-2 text-admin-primary" /> Products
          </h1>
          <p className="text-muted-foreground">Manage your product inventory.</p>
        </div>
        <Button className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              {categoryFilter || 'All Categories'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
              All Categories
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products table */}
      <Card>
        <CardContent className="p-0">
          {productsStatus === 'loading' ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[60px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <ProductRow key={product.id} product={product} />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const getInventoryStatus = (inventory: number) => {
    if (inventory <= 5) return { label: 'Low Stock', class: 'bg-admin-danger/10 text-admin-danger border-admin-danger/20' };
    if (inventory <= 20) return { label: 'Limited', class: 'bg-admin-warning/10 text-admin-warning border-admin-warning/20' };
    return { label: 'In Stock', class: 'bg-admin-success/10 text-admin-success border-admin-success/20' };
  };

  const inventoryStatus = getInventoryStatus(product.inventory);

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-muted/50 overflow-hidden">
            {product.images.length > 0 && (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-muted-foreground">{product.id}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-normal">
          {product.category}
        </Badge>
      </TableCell>
      <TableCell>
        ${product.price.toFixed(2)}
      </TableCell>
      <TableCell>
        <div className="font-medium">{product.inventory}</div>
        <div className="text-xs text-muted-foreground">
          {product.variants.length} variants
        </div>
      </TableCell>
      <TableCell>{product.vendor}</TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("font-normal", inventoryStatus.class)}>
          {inventoryStatus.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Link to={`/products/${product.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
