import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Palette,
  Ruler,
  Package,
  Tag,
  DollarSign,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Form 
} from '@/components/ui/form';
import { toast } from 'sonner';

interface ExistingProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  variants: number;
  image: string;
  sku: string;
  stock: number;
}

// Predefined variant attributes
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

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  attributes: z.record(z.string()),
});

const variantFormSchema = z.object({
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
});

type VariantFormValues = z.infer<typeof variantFormSchema>;

interface VariantCreationFormProps {
  existingProduct: ExistingProduct;
  onBack: () => void;
  onSubmit: (data: VariantFormValues) => void;
}

export default function VariantCreationForm({ 
  existingProduct, 
  onBack, 
  onSubmit 
}: VariantCreationFormProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  
  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      variants: [{
        name: '',
        sku: '',
        price: existingProduct.price,
        stock: 0,
        attributes: {}
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
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
    const currentVariants = form.getValues('variants');
    currentVariants.forEach((_, index) => {
      form.setValue(`variants.${index}.attributes.${attributeKey}`, '');
    });
  };

  const addVariant = () => {
    const newVariant = {
      name: '',
      sku: '',
      price: existingProduct.price,
      stock: 0,
      attributes: {}
    };
    append(newVariant);
  };

  const generateVariantName = (index: number) => {
    const variant = form.getValues(`variants.${index}`);
    const attributeValues = Object.values(variant.attributes).filter(val => val);
    if (attributeValues.length > 0) {
      const generatedName = `${existingProduct.name} - ${attributeValues.join(' / ')}`;
      form.setValue(`variants.${index}.name`, generatedName);
    }
  };

  const generateSKU = (index: number) => {
    const variant = form.getValues(`variants.${index}`);
    const baseSku = existingProduct.sku;
    const attributeValues = Object.values(variant.attributes)
      .filter(val => val)
      .map(val => val.substring(0, 2).toUpperCase());
    
    if (attributeValues.length > 0) {
      const generatedSku = `${baseSku}-${attributeValues.join('')}`;
      form.setValue(`variants.${index}.sku`, generatedSku);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Product Info Header */}
      <Card className="border-l-4 border-l-admin-primary">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={existingProduct.image} alt={existingProduct.name} />
              <AvatarFallback className="bg-admin-primary/10 text-admin-primary">
                {getInitials(existingProduct.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{existingProduct.name}</h2>
              <p className="text-muted-foreground">{existingProduct.category}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">Base Price: ${existingProduct.price}</Badge>
                <Badge variant="outline">{existingProduct.variants} existing variants</Badge>
                <Badge variant="outline">{existingProduct.stock} in stock</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attribute Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-admin-primary" />
            Select Variant Attributes
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
                  variant={isSelected ? "default" : "outline"}
                  className={`h-20 flex-col gap-2 ${isSelected ? 'bg-admin-primary' : ''}`}
                  onClick={() => isSelected ? handleRemoveAttribute(key) : handleAddAttribute(key)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{attribute.name}</span>
                </Button>
              );
            })}
          </div>
          
          {selectedAttributes.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Selected attributes: {selectedAttributes.map(attr => variantAttributes[attr as keyof typeof variantAttributes].name).join(', ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variant Forms */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-admin-primary" />
                Product Variants ({fields.length})
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Variant {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
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
                            control={form.control}
                            name={`variants.${index}.attributes.${attrKey}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{attribute.name}</FormLabel>
                                <Select 
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    // Auto-generate name and SKU when attribute changes
                                    setTimeout(() => {
                                      generateVariantName(index);
                                      generateSKU(index);
                                    }, 100);
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
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
                      control={form.control}
                      name={`variants.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter variant name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.sku`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter SKU" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="0.00"
                                className="pl-9"
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
                      control={form.control}
                      name={`variants.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
            <Button type="submit" className="bg-admin-primary hover:bg-admin-primary-hover">
              <Save className="h-4 w-4 mr-2" />
              Create Variants
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 