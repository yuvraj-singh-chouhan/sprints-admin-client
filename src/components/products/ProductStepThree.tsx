
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { ProductFormValues } from '@/pages/AddProductPage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  FormDescription 
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Plus, 
  Trash2, 
  Package, 
  Layers,
  Warehouse,
  Barcode,
  Hash,
  DollarSign,
  Palette,
  Ruler,
  Tag,
  Sparkles
} from 'lucide-react';

// Mock warehouse locations
const warehouseLocations = [
  { id: "main", name: "Main Warehouse" },
  { id: "west", name: "West Coast Fulfillment" },
  { id: "east", name: "East Coast Fulfillment" },
  { id: "central", name: "Central Distribution" }
];

// Predefined variant attributes (same as in VariantCreationForm)
const variantAttributes = {
  color: {
    name: 'Color',
    icon: Palette,
    options: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Gray', 'Brown']
  },
  size: {
    name: 'Size',
    icon: Ruler,
    options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '36', '38', '40', '42', '44', '46']
  },
  material: {
    name: 'Material',
    icon: Package,
    options: ['Cotton', 'Polyester', 'Leather', 'Denim', 'Silk', 'Wool', 'Linen', 'Synthetic']
  },
  storage: {
    name: 'Storage',
    icon: Hash,
    options: ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB']
  }
};

export default function ProductStepThree() {
  const { control, watch, setValue } = useFormContext<ProductFormValues>();
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("inventory");
  
  const productName = watch('name') || '';
  const basePrice = watch('price') || '0';
  const baseSku = watch('sku') || '';
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants'
  });

  const handleAddAttribute = (attributeKey: string) => {
    if (!selectedAttributes.includes(attributeKey)) {
      setSelectedAttributes([...selectedAttributes, attributeKey]);
    }
  };

  const handleRemoveAttribute = (attributeKey: string) => {
    setSelectedAttributes(selectedAttributes.filter(attr => attr !== attributeKey));
    // Clear the attribute from all variants
    const currentVariants = watch('variants') || [];
    currentVariants.forEach((_, index) => {
      setValue(`variants.${index}.attributes.${attributeKey}`, '');
    });
  };

  const addVariant = () => {
    const newVariant = {
      id: `variant-${Date.now()}`,
      name: '',
      sku: '',
      price: parseFloat(basePrice) || 0,
      stock: 0,
      attributes: {}
    };
    append(newVariant);
  };

  const generateVariantName = (index: number) => {
    const variant = watch(`variants.${index}`);
    if (!variant) return;
    
    const attributeValues = Object.values(variant.attributes || {}).filter(val => val);
    if (attributeValues.length > 0 && productName) {
      const generatedName = `${productName} - ${attributeValues.join(' / ')}`;
      setValue(`variants.${index}.name`, generatedName);
    }
  };

  const generateSKU = (index: number) => {
    const variant = watch(`variants.${index}`);
    if (!variant) return;
    
    const attributeValues = Object.values(variant.attributes || {})
      .filter(val => val)
      .map(val => val.substring(0, 2).toUpperCase());
    
    if (attributeValues.length > 0 && baseSku) {
      const generatedSku = `${baseSku}-${attributeValues.join('')}`;
      setValue(`variants.${index}.sku`, generatedSku);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-admin-primary/10 rounded-full animate-pulse">
            <Package className="h-6 w-6 text-admin-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Inventory & Variants</h2>
        <p className="text-muted-foreground">Manage your product inventory and create variants</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="variants" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Variants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <Card className="border-l-4 border-l-admin-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-admin-primary" />
                Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-admin-primary"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter the current stock quantity for this product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU / Barcode *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter product SKU or barcode"
                            className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-admin-primary"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        A unique identifier for your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={control}
                name="warehouse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse Location (Optional)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-admin-primary">
                          <SelectValue placeholder="Select warehouse location" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouseLocations.map(location => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select where this product is stored
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          {/* Variant Attributes Selection */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-600" />
                Variant Attributes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(variantAttributes).map(([key, attribute]) => {
                  const Icon = attribute.icon;
                  const isSelected = selectedAttributes.includes(key);
                  
                  return (
                    <Button
                      key={key}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className={`h-20 flex-col gap-2 transition-all duration-200 ${
                        isSelected ? 'bg-admin-primary hover:bg-admin-primary/90' : 'hover:border-admin-primary'
                      }`}
                      onClick={() => isSelected ? handleRemoveAttribute(key) : handleAddAttribute(key)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{attribute.name}</span>
                    </Button>
                  );
                })}
              </div>
              
              {selectedAttributes.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg animate-in fade-in duration-300">
                  <p className="text-sm font-medium text-blue-900 mb-2">Selected Attributes:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAttributes.map(attr => (
                      <Badge key={attr} variant="outline" className="bg-white border-blue-200">
                        {variantAttributes[attr as keyof typeof variantAttributes].name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variants List */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-green-600" />
                Product Variants ({fields.length})
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="hover:border-green-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No variants yet</h3>
                  <p className="text-gray-600 mb-4">Create variants to offer different options of your product</p>
                  <Button
                    type="button"
                    onClick={addVariant}
                    className="bg-admin-primary hover:bg-admin-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Variant
                  </Button>
                </div>
              ) : (
                fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-lg bg-gray-50/50 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-600" />
                        Variant {index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Variant Attributes */}
                    {selectedAttributes.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedAttributes.map((attrKey) => {
                          const attribute = variantAttributes[attrKey as keyof typeof variantAttributes];
                          return (
                            <FormField
                              key={attrKey}
                              control={control}
                              name={`variants.${index}.attributes.${attrKey}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">{attribute.name}</FormLabel>
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      // Auto-generate name and SKU when attribute changes
                                      setTimeout(() => {
                                        generateVariantName(index);
                                        generateSKU(index);
                                      }, 100);
                                    }}
                                    value={field.value || ''}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="h-9">
                                        <SelectValue placeholder={`Select ${attribute.name.toLowerCase()}`} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {attribute.options.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          );
                        })}
                      </div>
                    )}

                    <Separator />

                    {/* Variant Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name={`variants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Variant Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter variant name" 
                                className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`variants.${index}.sku`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">SKU</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter SKU" 
                                className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`variants.${index}.stock`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Stock Quantity</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
