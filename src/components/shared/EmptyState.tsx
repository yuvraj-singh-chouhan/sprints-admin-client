import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) => {
  return (
    <div className={`text-center py-12 ${className || ''}`}>
      <div className="flex flex-col items-center">
        <div className="text-muted-foreground mb-4">
          {icon}
        </div>
        <p className="text-lg font-medium mb-2">{title}</p>
        <p className="text-muted-foreground mb-4 max-w-md">
          {description}
        </p>
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState; 