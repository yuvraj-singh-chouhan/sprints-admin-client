import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'active' | 'inactive' | 'banned' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'refunded' | 'failed';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const StatusBadge = ({ status, type, className }: StatusBadgeProps) => {
  const getStatusStyle = (statusValue: string): string => {
    const normalizedStatus = statusValue.toLowerCase();
    
    switch (normalizedStatus) {
      case 'active':
      case 'delivered':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inactive':
      case 'banned':
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-normal capitalize',
        getStatusStyle(status),
        className
      )}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge; 