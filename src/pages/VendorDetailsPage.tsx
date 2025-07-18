
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendorStore, Vendor } from '@/lib/vendorStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  ArrowLeft, 
  Building, 
  Edit, 
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Activity,
  Star,
  Users,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ContactInfoCard from '@/components/shared/ContactInfoCard';
import StatsCard from '@/components/shared/StatsCard';

const VendorDetailsPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { vendors, vendorsStatus, fetchVendors } = useVendorStore();
  const [vendor, setVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    if (vendorsStatus !== 'loaded') {
      fetchVendors();
    }
  }, [fetchVendors, vendorsStatus]);

  useEffect(() => {
    if (vendors.length > 0 && vendorId) {
      const foundVendor = vendors.find(v => v.id === vendorId);
      if (foundVendor) {
        setVendor(foundVendor);
      } else {
        toast.error("Vendor not found");
        navigate("/vendors");
      }
    }
  }, [vendors, vendorId, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRevenueTrend = (revenue: number) => {
    // Mock trend calculation - in real app this would come from API
    const trend = Math.floor(Math.random() * 25) - 5;
    return {
      value: Math.abs(trend),
      isPositive: trend >= 0
    };
  };

  const getProductsTrend = (productsCount: number) => {
    // Mock trend calculation
    const trend = Math.floor(Math.random() * 15) - 5;
    return {
      value: Math.abs(trend),
      isPositive: trend >= 0
    };
  };

  const getAverageRevenuePerProduct = (revenue: number, productsCount: number) => {
    return productsCount > 0 ? (revenue / productsCount) : 0;
  };

  if (vendorsStatus === 'loading') {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate("/vendors")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors
        </Button>
        <div className="text-center py-12">
          <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Vendor not found</p>
          <p className="text-muted-foreground">The vendor you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const averageRevenuePerProduct = getAverageRevenuePerProduct(vendor.revenue, vendor.productsCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendors">Vendors</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{vendor.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/vendors")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="h-8 w-8 text-admin-primary" />
              {vendor.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              Partner since {formatDate(vendor.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Badge 
            variant={vendor.status === 'active' ? 'default' : 'secondary'}
            className="px-4 py-2 font-medium capitalize"
          >
            <Activity className="h-3 w-3 mr-1" />
            {vendor.status}
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-admin-primary/10 transition-colors"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={vendor.productsCount}
          subtitle="Listed products"
          icon={<Package className="h-5 w-5" />}
          trend={getProductsTrend(vendor.productsCount)}
          color="blue"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(vendor.revenue)}
          subtitle="Lifetime earnings"
          icon={<DollarSign className="h-5 w-5" />}
          trend={getRevenueTrend(vendor.revenue)}
          color="green"
        />
        <StatsCard
          title="Avg Revenue/Product"
          value={formatCurrency(averageRevenuePerProduct)}
          subtitle="Per product value"
          icon={<TrendingUp className="h-5 w-5" />}
          color="purple"
        />
        <StatsCard
          title="Vendor Rating"
          value="4.6"
          subtitle="Customer rating"
          icon={<Star className="h-5 w-5" />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <ContactInfoCard
          title="Vendor Information"
          name={vendor.name}
          email={vendor.email}
          phone={vendor.phone}
          address={vendor.address}
          status={vendor.status}
          createdAt={vendor.createdAt}
          contactPerson={vendor.contactPerson}
          icon={<Building className="h-5 w-5 text-admin-primary" />}
          statusVariant={vendor.status === 'active' ? 'default' : 'secondary'}
        />

        {/* Performance Metrics */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-admin-primary" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Monthly Revenue Chart Placeholder */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue Trend</h4>
                <div className="h-32 bg-gradient-to-r from-admin-primary/10 to-admin-primary/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 text-admin-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Revenue chart coming soon</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{vendor.productsCount}</div>
                  <div className="text-xs text-blue-600">Products</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(vendor.revenue / 1000)}K
                  </div>
                  <div className="text-xs text-green-600">Revenue</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-admin-primary" />
            Recent Activity & Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity Timeline */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h4>
              <div className="space-y-4">
                {/* Mock activity data - in real app this would come from API */}
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">New product added</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <Package className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Payment received</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ${formatCurrency(1250)}
                  </Badge>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Inventory updated</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                  <Edit className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Profile updated</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Top Products</h4>
              <div className="space-y-3">
                {/* Mock top products - in real app this would come from API */}
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-admin-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-admin-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Product {index + 1}</p>
                        <p className="text-xs text-gray-500">Category {index + 1}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${(Math.random() * 200 + 50).toFixed(0)}</p>
                      <p className="text-xs text-gray-500">{Math.floor(Math.random() * 50 + 10)} sold</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" className="text-sm">
                  View All Products
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-admin-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-admin-primary/10 transition-colors">
              <Package className="h-5 w-5" />
              <span className="text-xs">View Products</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-green-50 transition-colors">
              <DollarSign className="h-5 w-5" />
              <span className="text-xs">Payment History</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-blue-50 transition-colors">
              <Edit className="h-5 w-5" />
              <span className="text-xs">Edit Profile</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-purple-50 transition-colors">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDetailsPage;
