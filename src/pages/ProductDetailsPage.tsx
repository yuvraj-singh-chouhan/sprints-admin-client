
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore, Product } from '@/lib/store';
import { 
  Package, 
  ArrowLeft, 
  Tag, 
  Box, 
  BoxesIcon, 
  Store, 
  Edit, 
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Barcode,
  Layers,
  Eye,
  ShoppingCart,
  Star
} from 'lucide-react';
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from '@/lib/utils';

// Reusable Product Image Gallery Component
const ProductImageGallery = ({ product }: { product: Product }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 group">
        {product.images.length > 0 ? (
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {product.images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {product.images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "aspect-square rounded-md overflow-hidden border-2 transition-all duration-200",
                selectedImage === index 
                  ? "border-admin-primary shadow-md scale-105" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable Inventory Status Component
const InventoryStatusBadge = ({ inventory }: { inventory: number }) => {
  const getInventoryStatus = (stock: number) => {
    if (stock <= 5) return {
      label: 'Low Stock',
      variant: 'destructive' as const,
      icon: <AlertTriangle className="h-3 w-3" />,
      className: 'bg-red-100 text-red-800 border-red-200 animate-pulse'
    };
    if (stock <= 20) return {
      label: 'Limited',
      variant: 'secondary' as const,
      icon: <TrendingUp className="h-3 w-3" />,
      className: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return {
      label: 'In Stock',
      variant: 'default' as const,
      icon: <CheckCircle className="h-3 w-3" />,
      className: 'bg-green-100 text-green-800 border-green-200'
    };
  };

  const status = getInventoryStatus(inventory);

  return (
    <Badge 
      variant="outline" 
      className={cn("flex items-center gap-1 font-medium transition-all duration-300", status.className)}
    >
      {status.icon}
      {status.label}
    </Badge>
  );
};

// Reusable Metrics Card Component
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  color = "blue",
  subtitle 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color?: string;
  subtitle?: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <div className="text-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3", colorClasses[color as keyof typeof colorClasses])}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

// Reusable Product Info Section Component
const ProductInfoSection = ({ 
  title, 
  children, 
  icon 
}: { 
  title: string; 
  children: React.ReactNode; 
  icon?: React.ReactNode;
}) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, productsStatus, fetchProducts } = useStore();
  
  useEffect(() => {
    if (productsStatus === 'idle') {
      fetchProducts();
    }
  }, [productsStatus, fetchProducts]);
  
  const product = products.find(p => p.id === productId);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTotalVariantInventory = (product: Product) => {
    return product.variants.reduce((total, variant) => total + variant.inventory, 0);
  };

  if (productsStatus === 'loading') {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate("/products")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Product not found</p>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalVariantInventory = getTotalVariantInventory(product);
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-8 w-8 text-admin-primary" />
              {product.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Barcode className="h-4 w-4" />
              Product ID: {product.id}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <InventoryStatusBadge inventory={product.inventory} />
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-2xl font-bold text-admin-primary">${product.price.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Stock"
          value={product.inventory}
          icon={<Box className="h-6 w-6" />}
          color="blue"
          subtitle="Available units"
        />
        <MetricCard
          title="Variants"
          value={product.variants.length}
          icon={<Layers className="h-6 w-6" />}
          color="purple"
          subtitle={`${totalVariantInventory} total units`}
        />
        <MetricCard
          title="Revenue Potential"
          value={`$${(product.price * product.inventory).toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
          subtitle="At current price"
        />
        <MetricCard
          title="Categories"
          value={product.tags.length}
          icon={<Tag className="h-6 w-6" />}
          color="amber"
          subtitle="Product tags"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Gallery */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-admin-primary" />
              Product Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductImageGallery product={product} />
          </CardContent>
        </Card>

        {/* Product Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-admin-primary" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProductInfoSection 
              title="Description" 
              icon={<Package className="h-4 w-4" />}
            >
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md">
                {product.description}
              </p>
            </ProductInfoSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProductInfoSection 
                title="Pricing & Inventory" 
                icon={<DollarSign className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">Unit Price</span>
                    <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">Available Stock</span>
                    <span className="text-lg font-bold text-blue-600">{product.inventory}</span>
                  </div>
                </div>
              </ProductInfoSection>

              <ProductInfoSection 
                title="Category & Tags" 
                icon={<Tag className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-admin-primary/10 text-admin-primary border-admin-primary/20">
                        {product.category}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                        {product.subcategory}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </ProductInfoSection>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProductInfoSection 
                title="Vendor Information" 
                icon={<Store className="h-4 w-4" />}
              >
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-admin-primary/10 rounded-full flex items-center justify-center">
                    <Store className="h-5 w-5 text-admin-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{product.vendor}</p>
                    <p className="text-sm text-gray-500">Trusted vendor</p>
                  </div>
                </div>
              </ProductInfoSection>

              <ProductInfoSection 
                title="Timeline" 
                icon={<Calendar className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm font-medium">{formatDate(product.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium">{formatDate(product.updatedAt)}</span>
                  </div>
                </div>
              </ProductInfoSection>
            </div>
          </CardContent>
        </Card>

        {/* Product Variants */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BoxesIcon className="h-5 w-5 text-admin-primary" />
              Product Variants ({product.variants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.variants.map((variant, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/20 transition-colors">
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {variant.size}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-100"></div>
                          <span>{variant.color}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={variant.inventory <= 5 ? "destructive" : variant.inventory <= 20 ? "secondary" : "default"}
                          className="font-mono"
                        >
                          {variant.inventory}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${(variant.inventory * product.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <tfoot>
                  <TableRow className="bg-admin-primary/5 border-t-2 border-admin-primary/20">
                    <TableCell colSpan={3} className="font-semibold text-gray-900">
                      Total Variant Stock:
                    </TableCell>
                    <TableCell className="text-right font-bold text-admin-primary font-mono">
                      {totalVariantInventory} units
                    </TableCell>
                  </TableRow>
                </tfoot>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-admin-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start hover:bg-admin-primary/10 transition-colors">
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-blue-50 transition-colors">
              <Box className="mr-2 h-4 w-4" />
              Update Inventory
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-purple-50 transition-colors">
              <Layers className="mr-2 h-4 w-4" />
              Manage Variants
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-green-50 transition-colors">
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Orders
            </Button>
            
            <Separator className="my-4" />
            
            <Button variant="destructive" className="w-full justify-start hover:bg-red-600 transition-colors">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Product
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
