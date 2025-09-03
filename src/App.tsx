
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Lazy load pages for code splitting and better performance
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const CustomerDetailsPage = lazy(() => import("./pages/CustomerDetailsPage"));
const VendorsPage = lazy(() => import("./pages/VendorsPage"));
const VendorDetailsPage = lazy(() => import("./pages/VendorDetailsPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const UserDetailsPage = lazy(() => import("./pages/UserDetailsPage"));
const RolesPage = lazy(() => import("./pages/RolesPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

// Placeholder components for future implementation
const PayoutsPage = () => <div className="p-6">Payouts & Transactions (Coming Soon)</div>;
const SettingsPage = () => <div className="p-6">Settings (Coming Soon)</div>;

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <p className="text-lg">Loading...</p>
  </div>
);

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SonnerToaster position="top-right" />
        <Routes>
          <Route 
            path="/login" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <LoginPage />
              </Suspense>
            } 
          />

          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route 
              index 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Dashboard />
                </Suspense>
              } 
            />
            <Route 
              path="products" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProductsPage />
                </Suspense>
              } 
            />
            <Route 
              path="products/add" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AddProductPage />
                </Suspense>
              } 
            />
            <Route 
              path="products/:productId" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProductDetailsPage />
                </Suspense>
              } 
            />
            <Route 
              path="orders" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <OrdersPage />
                </Suspense>
              } 
            />
            <Route 
              path="orders/:orderId" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <OrderDetailsPage />
                </Suspense>
              } 
            />
            <Route 
              path="customers" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <CustomersPage />
                </Suspense>
              } 
            />
            <Route 
              path="customers/:customerId" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <CustomerDetailsPage />
                </Suspense>
              } 
            />
            <Route 
              path="vendors" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <VendorsPage />
                </Suspense>
              } 
            />
            <Route 
              path="vendors/:vendorId" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <VendorDetailsPage />
                </Suspense>
              } 
            />
            <Route 
              path="users" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <UsersPage />
                </Suspense>
              } 
            />
            <Route 
              path="users/:userId" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <UserDetailsPage />
                </Suspense>
              } 
            />
            <Route 
              path="roles" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <RolesPage />
                </Suspense>
              } 
            />
            <Route 
              path="shipping" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ShippingPage />
                </Suspense>
              } 
            />
            <Route path="payouts" element={<PayoutsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          <Route 
            path="*" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <NotFound />
              </Suspense>
            } 
          />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;

