
import { useFormContext } from 'react-hook-form';
import { ProductFormValues } from '@/pages/AddProductPage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProductReview() {
  const { watch } = useFormContext<ProductFormValues>();
  
  const {
    name, 
    description, 
    price, 
    category,
    subcategory,
    subsubcategory,
    images,
    stock,
    sku,
    warehouse,
    metaTitle,
    metaDescription,
    slug
  } = watch();
  
  // Find category names from their IDs (mock implementation)
  const getCategoryName = (id: string) => {
    const mockCategories: Record<string, string> = {
      "electronics": "Electronics",
      "computers": "Computers",
      "laptops": "Laptops",
      "desktops": "Desktop PCs",
      "tablets": "Tablets",
      "phones": "Phones & Accessories",
      "smartphones": "Smartphones",
      "cases": "Cases & Covers",
      "clothing": "Clothing",
      "mens": "Men's Clothing",
      "womens": "Women's Clothing",
      "kids": "Kids' Clothing",
      "home": "Home & Garden",
      "furniture": "Furniture",
      "kitchen": "Kitchen Supplies",
      "main": "Main Warehouse",
      "west": "West Coast Fulfillment",
      "east": "East Coast Fulfillment",
      "central": "Central Distribution"
    };
    
    return mockCategories[id] || id;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Your Product</h2>
      <p className="text-muted-foreground">
        Please review all information before publishing your product.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-muted-foreground">Product Name</h4>
                <p className="font-medium">{name}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground">Description</h4>
                <p className="text-sm whitespace-pre-wrap">{description}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground">Price</h4>
                <p className="font-medium">${price}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground">Categories</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {category && (
                    <Badge variant="outline">{getCategoryName(category)}</Badge>
                  )}
                  {subcategory && (
                    <Badge variant="outline">{getCategoryName(subcategory)}</Badge>
                  )}
                  {subsubcategory && (
                    <Badge variant="outline">{getCategoryName(subsubcategory)}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Media</h3>
            
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, i) => (
                <div key={image.id} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                  <img
                    src={image.url}
                    alt={`Product ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {i === 0 && (
                    <Badge className="absolute top-1 left-1 bg-black/50">Main</Badge>
                  )}
                </div>
              ))}
              
              {images.length === 0 && (
                <p className="col-span-3 text-center py-6 text-muted-foreground">
                  No images uploaded
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Inventory</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-muted-foreground">Stock Quantity</h4>
                <p className="font-medium">{stock}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground">SKU / Barcode</h4>
                <p className="font-medium">{sku}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground">Warehouse Location</h4>
                <p className="font-medium">
                  {warehouse ? getCategoryName(warehouse) : "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-muted-foreground">Meta Title</h4>
                <p className="font-medium">{metaTitle || name || "Not specified"}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground">Meta Description</h4>
                <p className="text-sm">{metaDescription || "Not specified"}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground">URL Slug</h4>
                <p className="font-medium text-blue-600">/products/{slug}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
