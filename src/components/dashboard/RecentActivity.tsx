
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Package, ShoppingCart, User, Briefcase } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-1">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={16} className="text-admin-primary" />;
      case 'product':
        return <Package size={16} className="text-admin-success" />;
      case 'customer':
        return <User size={16} className="text-admin-warning" />;
      case 'vendor':
        return <Briefcase size={16} className="text-admin-danger" />;
      default:
        return null;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-admin-primary/10';
      case 'product':
        return 'bg-admin-success/10';
      case 'customer':
        return 'bg-admin-warning/10';
      case 'vendor':
        return 'bg-admin-danger/10';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="flex items-center px-6 py-3 hover:bg-gray-50">
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", getBgColor(activity.type))}>
        {getIcon(activity.type)}
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium">{activity.description}</p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
    </div>
  );
}
