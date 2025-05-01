
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
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
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
  const selectedProduct = watch('variantProductId');
  
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<Subcategory[]>([]);
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
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

  // Filter products based on search query
  const filteredProducts = productsData.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {/* Searchable Category Dropdown */}
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <Popover open={categorySearchOpen} onOpenChange={setCategorySearchOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categorySearchOpen}
                        className="w-full justify-between"
                      >
                        {field.value
                          ? categoriesData.find(category => category.id === field.value)?.name
                          : "Select category"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search category..." className="h-9" />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {categoriesData.map((category) => (
                            <CommandItem
                              key={category.id}
                              value={category.id}
                              onSelect={() => {
                                setValue("category", category.id);
                                setCategorySearchOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === category.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {category.name}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subcategory - Only show if the selected category has subcategories */}
          {subcategories.length > 0 && (
            <FormField
              control={control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map(subcategory => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Sub-subcategory - Only show if the selected subcategory has sub-subcategories */}
          {subsubcategories.length > 0 && (
            <FormField
              control={control}
              name="subsubcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-subcategory</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subsubcategories.map(subsubcategory => (
                          <SelectItem key={subsubcategory.id} value={subsubcategory.id}>
                            {subsubcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}
