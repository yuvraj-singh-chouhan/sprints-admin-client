
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Package, ArrowLeft, Tag, Box, BoxesIcon, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn, formatDate } from '@/lib/utils';

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const { products, productsStatus, fetchProducts } = useStore();
  
  useEffect(() => {
    if (productsStatus === 'idle') {
      fetchProducts();
    }
  }, [productsStatus, fetchProducts]);
  
  const product = products.find(p => p.id === productId);
  
  if (productsStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-lg text-admin-danger">Product not found</p>
        <Link to="/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }
  
  const totalInventory = product.variants.reduce((total, variant) => total + variant.inventory, 0);
  const inventoryStatus = getInventoryStatus(product.inventory);
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/products">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Products</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center">
            <Package className="mr-2 text-admin-primary" /> Product Details
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">Edit Product</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main product info */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{product.id}</p>
              </div>
              <Badge variant="outline" className={cn("font-normal", inventoryStatus.class)}>
                {inventoryStatus.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0">
              <div className="w-full md:w-1/3">
                {product.images.length > 0 ? (
                  <div className="aspect-square rounded-md overflow-hidden bg-muted">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-md flex items-center justify-center bg-muted">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-row gap-2 mt-4">
                  {product.images.slice(1, 4).map((image, index) => (
                    <div key={index} className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p>{product.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                    <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Inventory</h3>
                    <p className="text-lg font-semibold">{product.inventory} items</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="font-normal">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="font-normal">
                      {product.subcategory}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Vendor</h3>
                  <div className="flex items-center">
                    <Store className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Link to={`/vendors/${product.vendor}`} className="text-blue-600 hover:underline">
                      {product.vendor}
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                    <p>{formatDate(product.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                    <p>{formatDate(product.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Sidebar info cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BoxesIcon className="h-5 w-5 mr-2 text-admin-primary" /> 
                Variants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.variants.map((variant, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{variant.size}</TableCell>
                      <TableCell>{variant.color}</TableCell>
                      <TableCell className="text-right">{variant.inventory}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Box className="mr-2 h-4 w-4" />
                Update Inventory
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Manage Variants
              </Button>
              <Separator className="my-2" />
              <Button variant="destructive" className="w-full justify-start">
                Delete Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getInventoryStatus(inventory: number) {
  if (inventory <= 5) return { label: 'Low Stock', class: 'bg-admin-danger/10 text-admin-danger border-admin-danger/20' };
  if (inventory <= 20) return { label: 'Limited', class: 'bg-admin-warning/10 text-admin-warning border-admin-warning/20' };
  return { label: 'In Stock', class: 'bg-admin-success/10 text-admin-success border-admin-success/20' };
}
