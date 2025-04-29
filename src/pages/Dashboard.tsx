
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { StatCard } from '@/components/dashboard/StatCard';
import { SalesChart, CategoryChart } from '@/components/dashboard/DashboardCharts';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, Briefcase, ShoppingCart, Wallet, Package, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">An overview of your store's performance.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm font-medium text-muted-foreground">Last updated: Today, 10:35 AM</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={isLoading ? '...' : dashboardStats?.totalUsers.toLocaleString() || '0'}
          icon={<Users size={18} className="text-admin-primary" />}
          trend={{ value: 12.5, label: "vs. last month", positive: true }}
          variant="purple"
        />
        <StatCard
          title="Total Vendors"
          value={isLoading ? '...' : dashboardStats?.totalVendors.toLocaleString() || '0'}
          icon={<Briefcase size={18} className="text-admin-success" />}
          trend={{ value: 8.2, label: "vs. last month", positive: true }}
          variant="success"
        />
        <StatCard
          title="Total Orders"
          value={isLoading ? '...' : dashboardStats?.totalOrders.toLocaleString() || '0'}
          icon={<ShoppingCart size={18} className="text-admin-warning" />}
          trend={{ value: 5.3, label: "vs. last month", positive: true }}
          variant="warning"
        />
        <StatCard
          title="Total Revenue"
          value={isLoading ? '...' : formatCurrency(dashboardStats?.totalRevenue || 0)}
          icon={<Wallet size={18} className="text-admin-danger" />}
          trend={{ value: 7.8, label: "vs. last month", positive: true }}
          variant="danger"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SalesChart />
        <CategoryChart />
      </div>

      {/* Additional stats and activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package size={18} className="mr-2" />
              Products in Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? '...' : dashboardStats?.productsInStock.toLocaleString() || '0'}</div>
          </CardContent>
          <CardFooter>
            <CardDescription>
              Across {isLoading ? '...' : '5'} categories
            </CardDescription>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell size={18} className="mr-2" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-admin-danger">{isLoading ? '...' : dashboardStats?.lowStockAlerts.toLocaleString() || '0'}</div>
          </CardContent>
          <CardFooter>
            <CardDescription>
              Products need attention
            </CardDescription>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart size={18} className="mr-2" />
              Orders Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-admin-warning">{isLoading ? '...' : '12'}</div>
          </CardContent>
          <CardFooter>
            <CardDescription>
              Awaiting processing
            </CardDescription>
          </CardFooter>
        </Card>
      </div>

      {/* Recent activity */}
      <RecentActivity 
        activities={dashboardStats?.recentActivities || []} 
      />
    </div>
  );
}
