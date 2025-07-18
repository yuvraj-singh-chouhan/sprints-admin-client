
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Package, 
  Search, 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Tag,
  Layers,
  Link2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import ProductStepOne from '@/components/products/ProductStepOne';
import ProductStepTwo from '@/components/products/ProductStepTwo';
import ProductStepThree from '@/components/products/ProductStepThree';
import ProductStepFour from '@/components/products/ProductStepFour';
import ProductReview from '@/components/products/ProductReview';
import VariantCreationForm from '@/components/products/VariantCreationForm';

// Mock product data for search
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

const existingProducts: ExistingProduct[] = [
  {
    id: "p1",
    name: "iPhone 15 Pro",
    price: 999,
    category: "Electronics > Phones",
    variants: 3,
    image: "/placeholder.svg",
    sku: "IPH15PRO",
    stock: 45
  },
  {
    id: "p2",
    name: "MacBook Pro 16\"",
    price: 2399,
    category: "Electronics > Laptops",
    variants: 5,
    image: "/placeholder.svg",
    sku: "MBP16",
    stock: 12
  },
  {
    id: "p3",
    name: "Nike Air Max 270",
    price: 150,
    category: "Fashion > Shoes",
    variants: 8,
    image: "/placeholder.svg",
    sku: "NAM270",
    stock: 67
  },
  {
    id: "p4",
    name: "Samsung Galaxy S24",
    price: 899,
    category: "Electronics > Phones",
    variants: 4,
    image: "/placeholder.svg",
    sku: "SGS24",
    stock: 28
  },
  {
    id: "p5",
    name: "Adidas Ultraboost 22",
    price: 180,
    category: "Fashion > Shoes",
    variants: 6,
    image: "/placeholder.svg",
    sku: "AUB22",
    stock: 34
  }
];

// Enhanced product schema
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Price must be a positive number",
  }),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().optional(),
  subsubcategory: z.string().optional(),
  images: z.array(z.object({
    url: z.string(),
    file: z.instanceof(File).optional(),
    id: z.string(),
    name: z.string(),
  })).min(1, "Please upload at least one image"),
  stock: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  sku: z.string().min(1, "SKU is required"),
  warehouse: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  variants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    sku: z.string(),
    stock: z.number(),
    attributes: z.record(z.string()),
  })).optional(),
  relatedProducts: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

type CreationMode = 'search' | 'variant' | 'new' | 'form';

export default function AddProductPage() {
  const navigate = useNavigate();
  const [creationMode, setCreationMode] = useState<CreationMode>('search');
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExistingProduct, setSelectedExistingProduct] = useState<ExistingProduct | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalSteps = 5;
  
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      subcategory: "",
      subsubcategory: "",
      images: [],
      stock: "0",
      sku: "",
      warehouse: "",
      metaTitle: "",
      metaDescription: "",
      slug: "",
      variants: [],
      relatedProducts: [],
    },
  });

  // Filter products based on search query
  const filteredProducts = existingProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductSelect = (product: ExistingProduct) => {
    setSelectedExistingProduct(product);
    setCreationMode('variant');
    setSearchOpen(false);
  };

  const handleCreateNew = () => {
    setCreationMode('form');
    setCurrentStep(1);
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof ProductFormValues)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["name", "description", "price", "category"];
        break;
      case 2:
        fieldsToValidate = ["images"];
        break;
      case 3:
        fieldsToValidate = ["stock", "sku"];
        break;
      case 4:
        fieldsToValidate = ["slug"];
        break;
      default:
        break;
    }

    const isValid = await methods.trigger(fieldsToValidate as any);
    if (isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (creationMode === 'form') {
      setCreationMode('search');
    }
  };

  const saveAsDraft = () => {
    const formData = methods.getValues();
    localStorage.setItem("productDraft", JSON.stringify(formData));
    toast.success("Product saved as draft");
  };

  const handleSubmit = methods.handleSubmit((data) => {
    console.log("Submitting product data:", data);
    toast.success("Product published successfully!");
    navigate("/products");
  });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProductStepOne />;
      case 2:
        return <ProductStepTwo />;
      case 3:
        return <ProductStepThree />;
      case 4:
        return <ProductStepFour />;
      case 5:
        return <ProductReview />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (creationMode === 'search') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="text-center py-12 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-admin-primary/10 rounded-full">
              <Package className="h-8 w-8 text-admin-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Product</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search for existing products to create variants, or start fresh with a completely new product
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-admin-primary" />
              Search Existing Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-muted-foreground"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search by product name, SKU, or category...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandEmpty>
                    <div className="text-center py-6">
                      <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No products found</p>
                    </div>
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {filteredProducts.map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() => handleProductSelect(product)}
                          className="p-4 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={product.image} alt={product.name} />
                              <AvatarFallback className="bg-admin-primary/10 text-admin-primary">
                                {getInitials(product.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  ${product.price}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {product.variants} variant{product.variants !== 1 ? 's' : ''}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {product.stock} in stock
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <Button size="sm" variant="ghost">
                                <Tag className="h-4 w-4 mr-1" />
                                Add Variant
                              </Button>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              onClick={handleCreateNew}
              className="w-full h-12 bg-admin-primary hover:bg-admin-primary-hover"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Product
            </Button>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Product Variants</h3>
            <p className="text-sm text-muted-foreground">
              Create multiple variants for existing products with different sizes, colors, or specifications
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Link2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Related Products</h3>
            <p className="text-sm text-muted-foreground">
              Link products together for cross-selling and better customer experience
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Smart Categories</h3>
            <p className="text-sm text-muted-foreground">
              Multi-level category system with search and easy navigation
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (creationMode === 'variant' && selectedExistingProduct) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Variant</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Product Found!</AlertTitle>
          <AlertDescription className="text-green-700">
            You're creating a new variant for <strong>{selectedExistingProduct.name}</strong>
          </AlertDescription>
        </Alert>

        <VariantCreationForm 
          existingProduct={selectedExistingProduct}
          onBack={() => setCreationMode('search')}
          onSubmit={(variantData) => {
            console.log('Creating variant:', variantData);
            toast.success("Product variant created successfully!");
            navigate("/products");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Package className="mr-2 text-admin-primary" /> Add New Product
          </h1>
          <p className="text-muted-foreground">Create a new product with detailed information</p>
        </div>
        
        {currentStep < totalSteps && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep} of {totalSteps - 1}</span>
          <span>{['Basic Info', 'Media', 'Inventory', 'SEO', 'Review'][currentStep - 1]}</span>
        </div>
        <Progress value={(currentStep / (totalSteps - 1)) * 100} className="h-2" />
      </div>
      
      <FormProvider {...methods}>
        <Card className="overflow-hidden">
          <div className="p-6">
            {renderStep()}
          </div>
          
          <div className="bg-muted/50 p-6 flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              {currentStep === 1 ? 'Back to Search' : 'Back'}
            </Button>
            
            <div className="space-x-2">
              {currentStep === totalSteps ? (
                <>
                  <Button variant="outline" onClick={handleBack}>Back to Edit</Button>
                  <Button onClick={handleSubmit} className="bg-admin-primary hover:bg-admin-primary/90">
                    Publish Product
                  </Button>
                </>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="bg-admin-primary hover:bg-admin-primary/90"
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </FormProvider>
    </div>
  );
}
