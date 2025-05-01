
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
  
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<Subcategory[]>([]);
  
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Category */}
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
