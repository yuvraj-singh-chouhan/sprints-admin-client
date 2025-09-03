
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
  ArrowLeft,
  CheckCircle,
  Tag,
  Layers,
  Link2,
  Sparkles,
  Save,
  Eye,
  Star,
  BarChart3,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/shared/PageHeader';
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

const stepInfo = [
  { 
    id: 1, 
    name: 'Basic Info', 
    description: 'Product details and pricing',
    icon: Package,
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 2, 
    name: 'Media', 
    description: 'Images and visual content',
    icon: Eye,
    color: 'from-purple-500 to-purple-600'
  },
  { 
    id: 3, 
    name: 'Inventory', 
    description: 'Stock and warehouse info',
    icon: BarChart3,
    color: 'from-green-500 to-green-600'
  },
  { 
    id: 4, 
    name: 'SEO', 
    description: 'Search optimization',
    icon: Star,
    color: 'from-amber-500 to-amber-600'
  },
  { 
    id: 5, 
    name: 'Review', 
    description: 'Final review and publish',
    icon: CheckCircle,
    color: 'from-emerald-500 to-emerald-600'
  }
];

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <PageHeader
          title="Add Product"
          description="Create new products or add variants to existing ones"
          icon={<Package className="h-8 w-8" />}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Add Product" }
          ]}
        />

        <div className="p-6 space-y-8 animate-in fade-in duration-700">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-12 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Package className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Create Your Next Product</h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Whether you're expanding an existing product line or launching something completely new, 
                we've made it simple and intuitive.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Smart categorization</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Multi-variant support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>SEO optimized</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Search Existing Products */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">Find Existing Products</CardTitle>
                <p className="text-slate-600">Search and add variants to your current product catalog</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-14 justify-start text-slate-500 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Search className="mr-3 h-5 w-5" />
                      Search by product name, SKU, or category...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[600px] p-0 shadow-2xl border-0" align="start">
                    <div className="bg-white rounded-xl overflow-hidden">
                      <Command>
                        <div className="border-b border-slate-100 p-4">
                          <CommandInput 
                            placeholder="Search products..." 
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className="text-base"
                          />
                        </div>
                        <CommandEmpty>
                          <div className="text-center py-12">
                            <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-4">
                              <Package className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-medium">No products found</p>
                            <p className="text-sm text-slate-400 mt-1">Try adjusting your search terms</p>
                          </div>
                        </CommandEmpty>
                        <CommandList className="max-h-[400px]">
                          <CommandGroup className="p-2">
                            {filteredProducts.map((product) => (
                              <CommandItem
                                key={product.id}
                                onSelect={() => handleProductSelect(product)}
                                className="p-4 cursor-pointer rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-200 mb-2"
                              >
                                <div className="flex items-center space-x-4 w-full">
                                  <Avatar className="h-16 w-16 ring-2 ring-blue-100">
                                    <AvatarImage src={product.image} alt={product.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                                      {getInitials(product.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 text-lg truncate">{product.name}</p>
                                    <p className="text-slate-500 mb-2">{product.category}</p>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                        ${product.price}
                                      </Badge>
                                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                        {product.variants} variant{product.variants !== 1 ? 's' : ''}
                                      </Badge>
                                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                                        {product.stock} in stock
                                      </Badge>
                                    </div>
                                  </div>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                                    <Tag className="h-4 w-4 mr-2" />
                                    Add Variant
                                  </Button>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Create New Product */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-emerald-200 transition-all duration-300">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800">Create New Product</CardTitle>
                <p className="text-slate-600">Start fresh with a completely new product from scratch</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="font-medium text-purple-800 mb-1">Smart Forms</div>
                      <div className="text-purple-600">Auto-completion & validation</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                      <div className="font-medium text-indigo-800 mb-1">Media Upload</div>
                      <div className="text-indigo-600">Drag & drop images</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200">
                      <div className="font-medium text-cyan-800 mb-1">SEO Ready</div>
                      <div className="text-cyan-600">Optimized for search</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200">
                      <div className="font-medium text-rose-800 mb-1">Auto-save</div>
                      <div className="text-rose-600">Never lose progress</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCreateNew}
                    className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="mr-3 h-5 w-5" />
                    Start Creating
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-sm">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Layers className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Product Variants</h3>
              <p className="text-slate-600 leading-relaxed">
                Create multiple variants for existing products with different sizes, colors, or specifications. Perfect for expanding your product line.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-sm">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                  <Link2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Smart Relationships</h3>
              <p className="text-slate-600 leading-relaxed">
                Link products together for cross-selling opportunities and provide customers with better shopping experiences.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-sm">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">AI-Powered Categories</h3>
              <p className="text-slate-600 leading-relaxed">
                Multi-level category system with intelligent suggestions and easy navigation for better product organization.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (creationMode === 'variant' && selectedExistingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
        <PageHeader
          title="Add Product Variant"
          description="Create a new variant for an existing product"
          icon={<Tag className="h-8 w-8" />}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Add Variant" }
          ]}
          action={{
            label: "Back to Search",
            onClick: () => setCreationMode('search'),
            icon: <ArrowLeft className="h-4 w-4" />
          }}
        />

        <div className="p-6 space-y-6 animate-in fade-in duration-500">
          <Alert className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
            <div className="p-2 bg-green-100 rounded-lg w-fit">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <AlertTitle className="text-green-800 text-lg font-semibold">Product Found!</AlertTitle>
            <AlertDescription className="text-green-700 text-base">
              You're creating a new variant for <strong>{selectedExistingProduct.name}</strong>. 
              All base information will be inherited and you can customize variant-specific details.
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <PageHeader
        title="Add New Product"
        description="Create a new product with detailed information"
        icon={<Package className="h-8 w-8" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Add Product" }
        ]}
        action={{
          label: "Back to Search",
          onClick: () => setCreationMode('search'),
          icon: <ArrowLeft className="h-4 w-4" />
        }}
      />

      <div className="p-6 space-y-8 animate-in fade-in duration-500">
        {/* Progress Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Product Creation Progress</h2>
                <p className="text-slate-600">Complete all steps to publish your product</p>
              </div>
              {currentStep < totalSteps && (
                <Button variant="outline" onClick={saveAsDraft} className="shadow-sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
              {stepInfo.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                  <div key={step.id} className="text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-all duration-300",
                      isActive ? `bg-gradient-to-br ${step.color} text-white shadow-lg scale-110` :
                      isCompleted ? "bg-green-500 text-white shadow-md" :
                      "bg-slate-100 text-slate-400"
                    )}>
                      <StepIcon className="h-6 w-6" />
                    </div>
                    <div className={cn(
                      "text-sm font-medium transition-colors",
                      isActive ? "text-slate-800" : "text-slate-500"
                    )}>
                      {step.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
              </div>
              <Progress 
                value={(currentStep / totalSteps) * 100} 
                className="h-3 bg-slate-100"
              />
            </div>
          </CardContent>
        </Card>
        
        <FormProvider {...methods}>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="p-8">
              {renderStep()}
            </div>
            
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 flex justify-between items-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1 && creationMode === 'form'}
                className="shadow-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentStep === 1 ? 'Back to Search' : 'Previous Step'}
              </Button>
              
              <div className="flex items-center gap-3">
                {currentStep === totalSteps ? (
                  <>
                    <Button variant="outline" onClick={handleBack} className="shadow-sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Edit
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Publish Product
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </FormProvider>
      </div>
    </div>
  );
}
