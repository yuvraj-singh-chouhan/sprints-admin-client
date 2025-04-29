
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Lazy load pages for code splitting and better performance
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

// Placeholder components for future implementation
const VendorsPage = () => <div className="p-6">Vendors Management (Coming Soon)</div>;
const CustomersPage = () => <div className="p-6">Customers Management (Coming Soon)</div>;
const ShippingPage = () => <div className="p-6">Shipping Management (Coming Soon)</div>;
const PayoutsPage = () => <div className="p-6">Payouts & Transactions (Coming Soon)</div>;
const SettingsPage = () => <div className="p-6">Settings (Coming Soon)</div>;

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <p className="text-lg">Loading...</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
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
              path="orders" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <OrdersPage />
                </Suspense>
              } 
            />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="shipping" element={<ShippingPage />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
