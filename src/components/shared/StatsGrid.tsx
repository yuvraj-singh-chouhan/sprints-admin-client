import { ReactNode } from 'react';
import StatsCard from './StatsCard';

interface StatItem {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red';
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
}

const StatsGrid = ({ stats, className }: StatsGridProps) => {
  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsGrid; 