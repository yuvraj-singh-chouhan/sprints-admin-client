
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { ProductFormValues } from '@/pages/AddProductPage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { 
  Check, 
  ChevronDown, 
  ChevronRight, 
  ChevronsUpDown, 
  Plus, 
  Search,
  X,
  Link2,
  Folder,
  FolderOpen,
  Tag,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced category structure with deeper nesting
interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
  icon?: string;
}

// Mock product data for related products
interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  imageUrl?: string;
  sku: string;
}

// Enhanced categories with multi-level support
const categoriesData: Category[] = [
  { 
    id: "electronics", 
    name: "Electronics",
    icon: "📱",
    subcategories: [
      { 
        id: "computers", 
        name: "Computers & Laptops",
        subcategories: [
          { id: "laptops", name: "Laptops" },
          { id: "desktops", name: "Desktop PCs" },
          { id: "tablets", name: "Tablets" },
          { id: "accessories", name: "Computer Accessories",
            subcategories: [
              { id: "keyboards", name: "Keyboards" },
              { id: "mice", name: "Mice" },
              { id: "monitors", name: "Monitors" },
              { id: "webcams", name: "Webcams" }
            ]
          }
        ]
      },
      { 
        id: "phones", 
        name: "Phones & Accessories",
        subcategories: [
          { id: "smartphones", name: "Smartphones" },
          { id: "cases", name: "Cases & Covers" },
          { id: "chargers", name: "Chargers & Cables" },
          { id: "headphones", name: "Headphones & Earbuds" }
        ]
      },
      {
        id: "home-audio",
        name: "Home Audio & Theater",
        subcategories: [
          { id: "speakers", name: "Speakers" },
          { id: "soundbars", name: "Soundbars" },
          { id: "headphones-audio", name: "Headphones" }
        ]
      }
    ]
  },
  { 
    id: "clothing", 
    name: "Clothing & Fashion",
    icon: "👕",
    subcategories: [
      { 
        id: "mens", 
        name: "Men's Clothing",
        subcategories: [
          { id: "mens-shirts", name: "Shirts" },
          { id: "mens-pants", name: "Pants" },
          { id: "mens-jackets", name: "Jackets & Coats" },
          { id: "mens-shoes", name: "Shoes",
            subcategories: [
              { id: "dress-shoes", name: "Dress Shoes" },
              { id: "sneakers", name: "Sneakers" },
              { id: "boots", name: "Boots" }
            ]
          }
        ]
      },
      { 
        id: "womens", 
        name: "Women's Clothing",
        subcategories: [
          { id: "womens-dresses", name: "Dresses" },
          { id: "womens-tops", name: "Tops & Blouses" },
          { id: "womens-bottoms", name: "Pants & Skirts" },
          { id: "womens-shoes", name: "Shoes" }
        ]
      },
      { id: "kids", name: "Kids' Clothing" }
    ]
  },
  { 
    id: "home", 
    name: "Home & Garden",
    icon: "🏠",
    subcategories: [
      { 
        id: "furniture", 
        name: "Furniture",
        subcategories: [
          { id: "living-room", name: "Living Room" },
          { id: "bedroom", name: "Bedroom" },
          { id: "office", name: "Office Furniture" }
        ]
      },
      { 
        id: "kitchen", 
        name: "Kitchen & Dining",
        subcategories: [
          { id: "appliances", name: "Appliances" },
          { id: "cookware", name: "Cookware" },
          { id: "tableware", name: "Tableware" }
        ]
      },
      { id: "garden", name: "Garden & Outdoor" }
    ]
  }
];

// Sample products for related products selection
const productsData: Product[] = [
  { id: "p1", name: "MacBook Pro 16", price: "2399", category: "laptops", imageUrl: "/placeholder.svg", sku: "MBP16" },
  { id: "p2", name: "iPhone 15 Pro", price: "999", category: "smartphones", imageUrl: "/placeholder.svg", sku: "IPH15PRO" },
  { id: "p3", name: "AirPods Pro", price: "249", category: "headphones", imageUrl: "/placeholder.svg", sku: "APP" },
  { id: "p4", name: "iPad Air", price: "599", category: "tablets", imageUrl: "/placeholder.svg", sku: "IPA" },
  { id: "p5", name: "Samsung Galaxy S23", price: "899", category: "smartphones", imageUrl: "/placeholder.svg", sku: "SGS23" },
  { id: "p6", name: "Dell XPS 15", price: "1599", category: "laptops", imageUrl: "/placeholder.svg", sku: "DXP15" },
  { id: "p7", name: "Levi's 501 Jeans", price: "89", category: "mens-pants", imageUrl: "/placeholder.svg", sku: "LV501" },
  { id: "p8", name: "Nike Air Max 90", price: "129", category: "sneakers", imageUrl: "/placeholder.svg", sku: "NAM90" },
  { id: "p9", name: "IKEA Desk", price: "299", category: "office", imageUrl: "/placeholder.svg", sku: "IKD" },
  { id: "p10", name: "KitchenAid Mixer", price: "349", category: "appliances", imageUrl: "/placeholder.svg", sku: "KAM" },
];

export default function ProductStepOne() {
  const { control, watch, setValue } = useFormContext<ProductFormValues>();
  
  const selectedCategory = watch('category');
  const selectedSubcategory = watch('subcategory');
  const selectedSubsubcategory = watch('subsubcategory');
  const relatedProducts = watch('relatedProducts') || [];
  
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);
  const [relatedProductsOpen, setRelatedProductsOpen] = useState(false);
  const [categorySearchText, setCategorySearchText] = useState("");
  const [relatedProductsSearch, setRelatedProductsSearch] = useState("");
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>([]);
  
  // Update selected category path when any category level changes
  useEffect(() => {
    const path: string[] = [];
    
    if (selectedCategory) {
      const findCategoryPath = (categories: Category[], targetId: string, currentPath: string[] = []): string[] | null => {
        for (const category of categories) {
          const newPath = [...currentPath, category.name];
          
          if (category.id === targetId) {
            return newPath;
          }
          
          if (category.subcategories) {
            const found = findCategoryPath(category.subcategories, targetId, newPath);
            if (found) return found;
          }
        }
        return null;
      };
      
      const categoryPath = findCategoryPath(categoriesData, selectedCategory);
      if (categoryPath) {
        setSelectedCategoryPath(categoryPath);
      }
    } else {
      setSelectedCategoryPath([]);
    }
  }, [selectedCategory, selectedSubcategory, selectedSubsubcategory]);

  // Filter products for related products selection
  const filteredProducts = productsData.filter(product => 
    product.name.toLowerCase().includes(relatedProductsSearch.toLowerCase()) ||
    product.sku.toLowerCase().includes(relatedProductsSearch.toLowerCase())
  );

  // Recursive function to render category tree
  const renderCategoryTree = (categories: Category[], depth = 0): React.ReactNode => {
    return categories.map(category => {
      if (categorySearchText && !category.name.toLowerCase().includes(categorySearchText.toLowerCase())) {
        const hasMatchingSubcategory = category.subcategories?.some(sub => 
          sub.name.toLowerCase().includes(categorySearchText.toLowerCase())
        );
        if (!hasMatchingSubcategory) return null;
      }

      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
      
      if (hasSubcategories) {
        return (
          <DropdownMenuSub key={category.id}>
            <DropdownMenuSubTrigger className={`flex items-center ${depth > 0 ? `pl-${depth * 2 + 2}` : ""}`}>
              <span className="flex items-center gap-2">
                {category.icon && <span className="text-sm">{category.icon}</span>}
                {depth === 0 ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                {category.name}
              </span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => {
                  setValue('category', category.id);
                  setValue('subcategory', '');
                  setValue('subsubcategory', '');
                  setCategorySearchOpen(false);
                }}
                className="font-medium"
              >
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {category.name} (All)
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {renderCategoryTree(category.subcategories, depth + 1)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        );
      } else {
        return (
          <DropdownMenuItem 
            key={category.id}
            onClick={() => {
              setValue('category', category.id);
              setValue('subcategory', '');
              setValue('subsubcategory', '');
              setCategorySearchOpen(false);
            }}
            className={`flex items-center gap-2 ${depth > 0 ? `pl-${depth * 2 + 2}` : ""}`}
          >
            {category.icon && <span className="text-sm">{category.icon}</span>}
            <Tag className="h-4 w-4" />
            {category.name}
          </DropdownMenuItem>
        );
      }
    }).filter(Boolean);
  };

  const getCategoryPathDisplay = () => {
    if (selectedCategoryPath.length === 0) return "Select category";
    return selectedCategoryPath.join(" > ");
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const addRelatedProduct = (productId: string) => {
    if (!relatedProducts.includes(productId)) {
      setValue('relatedProducts', [...relatedProducts, productId]);
    }
    setRelatedProductsOpen(false);
  };

  const removeRelatedProduct = (productId: string) => {
    setValue('relatedProducts', relatedProducts.filter(id => id !== productId));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-admin-primary/10 rounded-full animate-pulse">
            <Sparkles className="h-6 w-6 text-admin-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Product Information</h2>
        <p className="text-muted-foreground">Let's start with the essential details about your product</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <Card className="border-l-4 border-l-admin-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-admin-primary" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter a descriptive product name" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-admin-primary"
                        onChange={(e) => {
                          field.onChange(e);
                          // Auto-generate slug as user types
                          const slugValue = e.target.value
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, '')
                            .replace(/\s+/g, '-');
                          setValue('slug', slugValue);
                          setValue('metaTitle', e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product in detail - features, benefits, specifications" 
                        className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-admin-primary" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          if (!watch('metaDescription')) {
                            const truncated = e.target.value.substring(0, 160);
                            setValue('metaDescription', truncated);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input 
                          type="text"
                          placeholder="0.00" 
                          className="pl-7 transition-all duration-200 focus:ring-2 focus:ring-admin-primary" 
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Category & Related Products */}
        <div className="space-y-6">
          {/* Category Selection */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-600" />
                Category Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Product Category *</FormLabel>
                    <DropdownMenu open={categorySearchOpen} onOpenChange={setCategorySearchOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between h-12 transition-all duration-200 hover:border-admin-primary"
                        >
                          <span className="truncate text-left flex-1">
                            {getCategoryPathDisplay()}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-80 max-h-96 overflow-auto" 
                        align="start"
                      >
                        <div className="p-2">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search categories..."
                              value={categorySearchText}
                              onChange={(e) => setCategorySearchText(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        {categorySearchText && <DropdownMenuSeparator />}
                        {renderCategoryTree(categoriesData)}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-admin-primary">
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Create new category</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                    
                    {selectedCategoryPath.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedCategoryPath.map((pathItem, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs animate-in fade-in duration-300"
                          >
                            {pathItem}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Related Products */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-green-600" />
                Related Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Popover open={relatedProductsOpen} onOpenChange={setRelatedProductsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 transition-all duration-200 hover:border-green-500"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search and add related products...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search products..." 
                      value={relatedProductsSearch}
                      onValueChange={setRelatedProductsSearch}
                    />
                    <CommandEmpty>
                      <div className="text-center py-6">
                        <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No products found</p>
                      </div>
                    </CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {filteredProducts.map((product) => (
                          <CommandItem
                            key={product.id}
                            onSelect={() => addRelatedProduct(product.id)}
                            className="flex items-center p-3 cursor-pointer"
                            disabled={relatedProducts.includes(product.id)}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={product.imageUrl} alt={product.name} />
                                <AvatarFallback className="bg-green-50 text-green-600">
                                  {getInitials(product.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                <p className="text-sm text-muted-foreground">${product.price}</p>
                              </div>
                              {relatedProducts.includes(product.id) && (
                                <Check className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected Related Products */}
              {relatedProducts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Related Products:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {relatedProducts.map((productId) => {
                      const product = productsData.find(p => p.id === productId);
                      if (!product) return null;
                      
                      return (
                        <div 
                          key={productId} 
                          className="flex items-center gap-3 p-2 bg-green-50 rounded-lg animate-in fade-in duration-300"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={product.imageUrl} alt={product.name} />
                            <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                              {getInitials(product.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">${product.price}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRelatedProduct(productId)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
