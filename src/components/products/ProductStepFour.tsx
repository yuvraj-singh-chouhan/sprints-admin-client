
import { useFormContext } from 'react-hook-form';
import { ProductFormValues } from '@/pages/AddProductPage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';

export default function ProductStepFour() {
  const { control, watch } = useFormContext<ProductFormValues>();
  const metaDescription = watch('metaDescription') || '';

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">SEO Settings</h2>
      
      <div className="space-y-4">
        <FormField
          control={control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Product page title for search engines"
                  {...field}
                  maxLength={60}
                />
              </FormControl>
              <FormDescription>
                {field.value?.length || 0}/60 characters (Recommended: 50-60)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description for search results"
                  {...field}
                  maxLength={160}
                  className="resize-none h-24"
                />
              </FormControl>
              <FormDescription>
                {metaDescription.length}/160 characters (Recommended: 150-160)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">/products/</span>
                  <Input
                    placeholder="product-url-slug"
                    {...field}
                    className="flex-1"
                    onChange={(e) => {
                      // Automatically format slug (remove spaces, special chars)
                      const formattedSlug = e.target.value
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                      field.onChange(formattedSlug);
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                The URL-friendly version of the product name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
