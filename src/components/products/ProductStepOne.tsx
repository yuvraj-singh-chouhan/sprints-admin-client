
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
  Form 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
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
import { Check, ChevronDown, ChevronRight, ChevronsUpDown, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define proper types for our category structure
interface Subcategory {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

// Mock product data for variant selection
interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  imageUrl?: string;
}

// Sample products data
const productsData: Product[] = [
  { id: "p1", name: "MacBook Pro 16", price: "2399", category: "laptops", imageUrl: "/placeholder.svg" },
  { id: "p2", name: "iPhone 15 Pro", price: "999", category: "smartphones", imageUrl: "/placeholder.svg" },
  { id: "p3", name: "AirPods Pro", price: "249", category: "phones", imageUrl: "/placeholder.svg" },
  { id: "p4", name: "iPad Air", price: "599", category: "tablets", imageUrl: "/placeholder.svg" },
  { id: "p5", name: "Samsung Galaxy S23", price: "899", category: "smartphones", imageUrl: "/placeholder.svg" },
  { id: "p6", name: "Dell XPS 15", price: "1599", category: "laptops", imageUrl: "/placeholder.svg" },
  { id: "p7", name: "Levi's Jeans", price: "89", category: "mens", imageUrl: "/placeholder.svg" },
  { id: "p8", name: "Nike Running Shoes", price: "129", category: "mens", imageUrl: "/placeholder.svg" },
  { id: "p9", name: "IKEA Desk", price: "299", category: "furniture", imageUrl: "/placeholder.svg" },
  { id: "p10", name: "KitchenAid Mixer", price: "349", category: "kitchen", imageUrl: "/placeholder.svg" },
];

// Mock categories data with proper typing
const categoriesData: Category[] = [
  { 
    id: "electronics", 
    name: "Electronics",
    subcategories: [
      { 
        id: "computers", 
        name: "Computers",
        subcategories: [
          { id: "laptops", name: "Laptops" },
          { id: "desktops", name: "Desktop PCs" },
          { id: "tablets", name: "Tablets" }
        ]
      },
      { 
        id: "phones", 
        name: "Phones & Accessories",
        subcategories: [
          { id: "smartphones", name: "Smartphones" },
          { id: "cases", name: "Cases & Covers" }
        ]
      }
    ]
  },
  { 
    id: "clothing", 
    name: "Clothing",
    subcategories: [
      { id: "mens", name: "Men's Clothing" },
      { id: "womens", name: "Women's Clothing" },
      { id: "kids", name: "Kids' Clothing" }
    ]
  },
  { 
    id: "home", 
    name: "Home & Garden",
    subcategories: [
      { id: "furniture", name: "Furniture" },
      { id: "kitchen", name: "Kitchen Supplies" }
    ]
  }
];

export default function ProductStepOne() {
  const { control, watch, setValue } = useFormContext<ProductFormValues>();
  
  const selectedCategory = watch('category');
  const selectedSubcategory = watch('subcategory');
  const selectedSubsubcategory = watch('subsubcategory');
  const selectedProduct = watch('variantProductId');
  
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<Subcategory[]>([]);
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryTreeOpen, setCategoryTreeOpen] = useState(false);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>([]);
  const [categorySearchText, setCategorySearchText] = useState("");
  
  // Update subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      setValue('subcategory', '');
      return;
    }
    
    const category = categoriesData.find(cat => cat.id === selectedCategory);
    if (category && category.subcategories) {
      setSubcategories(category.subcategories);
    } else {
      setSubcategories([]);
    }
    
    setValue('subcategory', '');
    setValue('subsubcategory', '');
  }, [selectedCategory, setValue]);
  
  // Update sub-subcategories when subcategory changes
  useEffect(() => {
    if (!selectedSubcategory) {
      setSubsubcategories([]);
      setValue('subsubcategory', '');
      return;
    }
    
    const category = categoriesData.find(cat => cat.id === selectedCategory);
    if (!category) return;
    
    const subcategory = category.subcategories?.find(
      subcat => subcat.id === selectedSubcategory
    );
    
    if (subcategory && subcategory.subcategories) {
      setSubsubcategories(subcategory.subcategories);
    } else {
      setSubsubcategories([]);
    }
    
    setValue('subsubcategory', '');
  }, [selectedSubcategory, selectedCategory, setValue]);

  // Update selected category path when any category level changes
  useEffect(() => {
    const path: string[] = [];
    
    if (selectedCategory) {
      const category = categoriesData.find(c => c.id === selectedCategory);
      if (category) path.push(category.name);
      
      if (selectedSubcategory && category?.subcategories) {
        const subcategory = category.subcategories.find(sc => sc.id === selectedSubcategory);
        if (subcategory) path.push(subcategory.name);
        
        if (selectedSubsubcategory && subcategory?.subcategories) {
          const subsubcategory = subcategory.subcategories.find(ssc => ssc.id === selectedSubsubcategory);
          if (subsubcategory) path.push(subsubcategory.name);
        }
      }
    }
    
    setSelectedCategoryPath(path);
  }, [selectedCategory, selectedSubcategory, selectedSubsubcategory]);

  // Filter products based on search query
  const filteredProducts = productsData.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to render categories recursively
  const renderCategoryTree = (categories: Category[], depth = 0) => {
    return categories.map(category => {
      // Filter out categories that don't match search text if we have any
      if (categorySearchText && !category.name.toLowerCase().includes(categorySearchText.toLowerCase())) {
        // If this category doesn't match, check if any of its subcategories match
        if (!category.subcategories || !category.subcategories.some(sub => 
          sub.name.toLowerCase().includes(categorySearchText.toLowerCase())
        )) {
          return null;
        }
      }

      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
      
      if (hasSubcategories) {
        return (
          <DropdownMenuSub key={category.id}>
            <DropdownMenuSubTrigger className={depth > 0 ? `pl-${depth * 2 + 2}` : ""}>
              {category.name}
              {depth === 0 && <ChevronRight className="ml-auto h-4 w-4" />}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => {
                  setValue('category', category.id);
                  setValue('subcategory', '');
                  setValue('subsubcategory', '');
                  setCategoryTreeOpen(false);
                }}
                className="font-medium"
              >
                {category.name} (All)
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
              if (depth === 0) {
                setValue('category', category.id);
                setValue('subcategory', '');
                setValue('subsubcategory', '');
              } else if (depth === 1) {
                const parentCategory = categoriesData.find(cat => 
                  cat.subcategories?.some(sub => sub.id === category.id)
                );
                if (parentCategory) {
                  setValue('category', parentCategory.id);
                  setValue('subcategory', category.id);
                  setValue('subsubcategory', '');
                }
              } else if (depth === 2) {
                let parentCategoryId = '';
                let parentSubcategoryId = '';
                
                categoriesData.forEach(cat => {
                  cat.subcategories?.forEach(subcat => {
                    if (subcat.subcategories?.some(subsub => subsub.id === category.id)) {
                      parentCategoryId = cat.id;
                      parentSubcategoryId = subcat.id;
                    }
                  });
                });
                
                if (parentCategoryId && parentSubcategoryId) {
                  setValue('category', parentCategoryId);
                  setValue('subcategory', parentSubcategoryId);
                  setValue('subsubcategory', category.id);
                }
              }
              setCategoryTreeOpen(false);
            }}
            className={depth > 0 ? `pl-${depth * 2 + 2}` : ""}
          >
            {category.name}
          </DropdownMenuItem>
        );
      }
    }).filter(Boolean); // Filter out nulls (non-matching categories)
  };

  const getCategoryPathDisplay = () => {
    if (selectedCategoryPath.length === 0) return "Select category";
    return selectedCategoryPath.join(" > ");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Basic Product Information</h2>
      
      <div className="space-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter product name" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    // Auto-generate slug as user types product name
                    const slugValue = e.target.value
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-');
                    setValue('slug', slugValue);
                    if (!field.value) {
                      setValue('metaTitle', '');
                    } else {
                      setValue('metaTitle', e.target.value);
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your product" 
                  className="min-h-[120px]" 
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
              <FormLabel>Sale Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input 
                    type="text"
                    placeholder="0.00" 
                    className="pl-7" 
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tree-like Category Selector */}
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <DropdownMenu open={categoryTreeOpen} onOpenChange={setCategoryTreeOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="truncate">{getCategoryPathDisplay()}</span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-64 max-h-96 overflow-auto" 
                    align="start"
                  >
                    <div className="p-2">
                      <Input
                        placeholder="Search categories..."
                        value={categorySearchText}
                        onChange={(e) => setCategorySearchText(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {categorySearchText && <DropdownMenuSeparator />}
                    {renderCategoryTree(categoriesData)}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Create new category</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Product Search for Variants */}
          <FormField
            control={control}
            name="variantProductId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Related Product or Variant</FormLabel>
                <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={productSearchOpen}
                        className="w-full justify-between"
                      >
                        {field.value
                          ? productsData.find(product => product.id === field.value)?.name
                          : "Search products"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search products..." 
                        className="h-9"
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                      />
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {filteredProducts.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={product.id}
                              onSelect={() => {
                                setValue("variantProductId", product.id);
                                setProductSearchOpen(false);
                              }}
                              className="flex items-center"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === product.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-2">
                                {product.imageUrl && (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-6 w-6 object-cover rounded"
                                  />
                                )}
                                <div className="flex flex-col">
                                  <span>{product.name}</span>
                                  <span className="text-xs text-muted-foreground">${product.price}</span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
