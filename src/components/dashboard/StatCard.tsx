
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

const statCardVariants = cva(
  "group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 backdrop-blur-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white/80",
        purple: "bg-white/80",
        success: "bg-white/80", 
        warning: "bg-white/80",
        danger: "bg-white/80",
        blue: "bg-white/80",
        emerald: "bg-white/80",
        amber: "bg-white/80",
        violet: "bg-white/80",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const gradientVariants = {
  default: "from-slate-500/10 to-slate-600/10",
  purple: "from-purple-500/10 to-purple-600/10",
  success: "from-emerald-500/10 to-green-600/10",
  warning: "from-amber-500/10 to-orange-600/10", 
  danger: "from-red-500/10 to-red-600/10",
  blue: "from-blue-500/10 to-blue-600/10",
  emerald: "from-emerald-500/10 to-emerald-600/10",
  amber: "from-amber-500/10 to-amber-600/10",
  violet: "from-violet-500/10 to-violet-600/10",
};

const iconBgVariants = {
  default: "from-slate-500 to-slate-600",
  purple: "from-purple-500 to-purple-600",
  success: "from-emerald-500 to-emerald-600",
  warning: "from-amber-500 to-amber-600",
  danger: "from-red-500 to-red-600", 
  blue: "from-blue-500 to-blue-600",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
  violet: "from-violet-500 to-violet-600",
};

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
  badge?: string;
  subtitle?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  variant = "default", 
  className,
  badge,
  subtitle
}: StatCardProps) {
  const gradientClass = gradientVariants[variant || "default"];
  const iconBgClass = iconBgVariants[variant || "default"];

  return (
    <Card className={cn(statCardVariants({ variant }), className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradientClass)}></div>
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 bg-gradient-to-br rounded-xl shadow-lg", iconBgClass)}>
            <div className="text-white [&>svg]:h-6 [&>svg]:w-6">
              {icon}
            </div>
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1",
              trend.positive ? "text-emerald-600" : "text-red-600"
            )}>
              {trend.positive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-slate-800">
            {value}
          </p>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <p className="text-xs text-slate-500">{trend.label}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
