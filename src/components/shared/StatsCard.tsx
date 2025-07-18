import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red';
  className?: string;
}

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  className
}: StatsCardProps) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card className={cn(
      "relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1", 
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className={cn(
            "p-2 rounded-lg transition-colors duration-300",
            colors.bg,
            colors.text
          )}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold text-gray-900 animate-in fade-in duration-500">
              {value}
            </p>
            {trend && (
              <div className={cn(
                "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                trend.isPositive 
                  ? "text-green-700 bg-green-100" 
                  : "text-red-700 bg-red-100"
              )}>
                <span className={cn(
                  "mr-1",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}>
                  {trend.isPositive ? "↗" : "↘"}
                </span>
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
      
      {/* Animated background accent */}
      <div className={cn(
        "absolute bottom-0 left-0 w-full h-1 transition-all duration-500",
        colors.bg,
        "group-hover:h-2"
      )} />
    </Card>
  );
};

export default StatsCard; 