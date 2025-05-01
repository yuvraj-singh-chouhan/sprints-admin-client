
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ProductStepOne from '@/components/products/ProductStepOne';
import ProductStepTwo from '@/components/products/ProductStepTwo';
import ProductStepThree from '@/components/products/ProductStepThree';
import ProductStepFour from '@/components/products/ProductStepFour';
import ProductReview from '@/components/products/ProductReview';

// Define the schema for the complete product form
const productSchema = z.object({
  // Step 1: Basic Information
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Price must be a positive number",
  }),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().optional(),
  subsubcategory: z.string().optional(),
  
  // Step 2: Media
  images: z.array(z.object({
    url: z.string(),
    file: z.instanceof(File).optional(),
    id: z.string(),
    name: z.string(),
  })).min(1, "Please upload at least one image"),
  
  // Step 3: Inventory
  stock: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  sku: z.string().min(1, "SKU is required"),
  warehouse: z.string().optional(),
  
  // Step 4: SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Including review step
  
  // Initialize form with react-hook-form and zod validation
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
    },
  });
  
  // Function to handle step navigation
  const handleNext = async () => {
    // Validate the current step
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
    }
  };
  
  const saveAsDraft = () => {
    const formData = methods.getValues();
    // Here you would typically save to localStorage or your backend
    localStorage.setItem("productDraft", JSON.stringify(formData));
    toast.success("Product saved as draft");
  };
  
  const handleSubmit = methods.handleSubmit((data) => {
    // Here you would typically submit to your backend
    console.log("Submitting product data:", data);
    toast.success("Product published successfully!");
    navigate("/products");
  });
  
  // Render the current step content
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
  
  return (
    <div className="space-y-8 animate-fade-in">
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
              Back
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
