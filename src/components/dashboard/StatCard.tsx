
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const statCardVariants = cva(
  "transition-all",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white",
        purple: "border-admin-primary/20 bg-admin-primary/5",
        success: "border-admin-success/20 bg-admin-success/5",
        warning: "border-admin-warning/20 bg-admin-warning/5",
        danger: "border-admin-danger/20 bg-admin-danger/5",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  variant, 
  className 
}: StatCardProps) {
  return (
    <Card className={cn(statCardVariants({ variant }), className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="mt-1 text-xs flex items-center">
            <span 
              className={cn(
                "mr-1", 
                trend.positive ? "text-admin-success" : "text-admin-danger"
              )}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
