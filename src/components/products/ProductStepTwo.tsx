
import { useFormContext } from 'react-hook-form';
import { useState, useRef, useCallback } from 'react';
import { ProductFormValues } from '@/pages/AddProductPage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductStepTwo() {
  const { control, setValue, watch } = useFormContext<ProductFormValues>();
  const images = watch('images');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop and selection
  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      return {
        url,
        file,
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
      };
    });

    setValue('images', [...images, ...newImages]);
  }, [images, setValue]);

  // Handle dropping files
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  // Handle drag events
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Remove an image
  const removeImage = (idToRemove: string) => {
    setValue('images', images.filter(img => img.id !== idToRemove));
    toast.success('Image removed');
  };

  // Reorder images
  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setValue('images', newImages);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Product Media</h2>
      
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
          "hover:border-primary/50 hover:bg-muted/30"
        )}
        onClick={triggerFileInput}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="bg-primary/10 rounded-full p-3">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Drag images here or click to upload</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Support for JPG, PNG and GIF files. Max file size 5MB.
          </p>
          <Button type="button" variant="outline" onClick={(e) => {
            e.stopPropagation();
            triggerFileInput();
          }}>
            Select Files
          </Button>
        </div>
      </div>
      
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Uploaded Images ({images.length})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-background/80 p-1 rounded-full hover:bg-background"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="p-3 bg-muted/50 flex justify-between items-center">
                  <p className="text-xs truncate" title={image.name}>{image.name}</p>
                  
                  <div className="flex space-x-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
