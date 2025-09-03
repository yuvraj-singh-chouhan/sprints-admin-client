
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { StatCard } from '@/components/dashboard/StatCard';
import { SalesChart, CategoryChart } from '@/components/dashboard/DashboardCharts';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { 
  Users, 
  Briefcase, 
  ShoppingCart, 
  Wallet, 
  Package, 
  Bell, 
  TrendingUp,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';

export default function Dashboard() {
  const { dashboardStats, dashboardStatus, fetchDashboardStats } = useStore();

  useEffect(() => {
    if (dashboardStatus === 'idle') {
      fetchDashboardStats();
    }
  }, [dashboardStatus, fetchDashboardStats]);

  const isLoading = dashboardStatus === 'loading';

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <PageHeader
        title="Dashboard"
        description="Monitor your store's performance and key metrics"
        icon={<BarChart3 className="h-8 w-8" />}
        breadcrumbs={[
          { label: "Dashboard" }
        ]}
        action={{
          label: "View Reports",
          onClick: () => {},
          icon: <TrendingUp className="h-4 w-4" />
        }}
      />

      <div className="p-6 space-y-8 animate-in fade-in duration-700">
        {/* Welcome Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
                <p className="text-xl text-white/90 mb-4">Here's what's happening with your store today.</p>
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Last updated: {getCurrentTime()}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {isLoading ? '...' : dashboardStats?.totalOrders || '0'}
                  </div>
                  <div className="text-white/80 text-sm">Today's Orders</div>
                </div>
                <div className="w-px bg-white/20 mx-4"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {isLoading ? '...' : formatCurrency(dashboardStats?.todayRevenue || 24750)}
                  </div>
                  <div className="text-white/80 text-sm">Today's Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-800">
                  {isLoading ? '...' : dashboardStats?.totalUsers.toLocaleString() || '2,847'}
                </p>
                <p className="text-slate-600 text-sm">Total Customers</p>
                <p className="text-xs text-slate-500">vs. last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-600/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">+8.2%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-800">
                  {isLoading ? '...' : dashboardStats?.totalVendors.toLocaleString() || '142'}
                </p>
                <p className="text-slate-600 text-sm">Active Vendors</p>
                <p className="text-xs text-slate-500">vs. last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">+5.3%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-800">
                  {isLoading ? '...' : dashboardStats?.totalOrders.toLocaleString() || '8,945'}
                </p>
                <p className="text-slate-600 text-sm">Total Orders</p>
                <p className="text-xs text-slate-500">vs. last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-600/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">+15.8%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-800">
                  {isLoading ? '...' : formatCurrency(dashboardStats?.totalRevenue || 847562)}
                </p>
                <p className="text-slate-600 text-sm">Total Revenue</p>
                <p className="text-xs text-slate-500">vs. last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Sales Analytics
                </CardTitle>
              </CardHeader>
              <SalesChart />
            </Card>
          </div>
          <div>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <PieChart className="h-5 w-5 text-slate-600" />
                  Category Distribution
                </CardTitle>
              </CardHeader>
              <CategoryChart />
            </Card>
          </div>
        </div>

        {/* Enhanced Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-slate-800">Products in Stock</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-3xl font-bold text-slate-800 mb-2">
                {isLoading ? '...' : dashboardStats?.productsInStock.toLocaleString() || '1,247'}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Across 5 categories</span>
                <div className="flex items-center gap-1 text-emerald-600 text-sm">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+2.4%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t bg-slate-50/50">
              <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:bg-blue-50">
                View Inventory
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-slate-800">Low Stock Alerts</span>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                  Critical
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {isLoading ? '...' : dashboardStats?.lowStockAlerts.toLocaleString() || '23'}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Products need attention</span>
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+5 today</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t bg-slate-50/50">
              <Button variant="ghost" size="sm" className="w-full text-red-600 hover:bg-red-50">
                Manage Stock
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-slate-800">Pending Orders</span>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  Processing
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {isLoading ? '...' : '47'}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Awaiting processing</span>
                <div className="flex items-center gap-1 text-amber-600 text-sm">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>-12 today</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t bg-slate-50/50">
              <Button variant="ghost" size="sm" className="w-full text-amber-600 hover:bg-amber-50">
                Process Orders
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Enhanced Recent Activity */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="h-5 w-5 text-slate-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your store</CardDescription>
          </CardHeader>
          <RecentActivity 
            activities={dashboardStats?.recentActivities || []} 
          />
        </Card>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-2 border-dashed border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <Package className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Add Product</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-2 border-dashed border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
          >
            <Users className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Add Customer</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-2 border-dashed border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">New Order</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-2 border-dashed border-amber-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200"
          >
            <BarChart3 className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">View Reports</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
