
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Sample data
const salesData = [
  { month: 'Jan', sales: 65000 },
  { month: 'Feb', sales: 72000 },
  { month: 'Mar', sales: 68000 },
  { month: 'Apr', sales: 75000 },
  { month: 'May', sales: 82000 },
  { month: 'Jun', sales: 91000 },
];

const orderVolumeData = [
  { month: 'Jan', orders: 420 },
  { month: 'Feb', orders: 460 },
  { month: 'Mar', orders: 440 },
  { month: 'Apr', orders: 480 },
  { month: 'May', orders: 520 },
  { month: 'Jun', orders: 580 },
];

const categoryData = [
  { name: 'Running', value: 35 },
  { name: 'Basketball', value: 28 },
  { name: 'Casual', value: 42 },
  { name: 'Formal', value: 18 },
  { name: 'Sports', value: 25 },
];

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export function SalesChart() {
  return (
    <Card className="col-span-full xl:col-span-2">
      <CardHeader>
        <CardTitle>Sales Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue">
          <TabsList className="mb-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  name="Revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="orders" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderVolumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" name="Orders" fill="#8B5CF6" barSize={40} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export function CategoryChart() {
  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
