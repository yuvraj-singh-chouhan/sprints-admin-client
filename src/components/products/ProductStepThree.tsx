
import { useFormContext } from 'react-hook-form';
import { ProductFormValues } from '@/pages/AddProductPage';
import { Input } from '@/components/ui/input';
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

// Mock warehouse locations - In a real app, these would come from your backend
const warehouseLocations = [
  { id: "main", name: "Main Warehouse" },
  { id: "west", name: "West Coast Fulfillment" },
  { id: "east", name: "East Coast Fulfillment" },
  { id: "central", name: "Central Distribution" }
];

export default function ProductStepThree() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Inventory Management</h2>
      
      <div className="space-y-4">
        <FormField
          control={control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  {...field}
                />
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
              <FormLabel>SKU / Barcode</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product SKU or barcode"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A unique identifier for your product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                  <SelectTrigger>
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
      </div>
    </div>
  );
}
