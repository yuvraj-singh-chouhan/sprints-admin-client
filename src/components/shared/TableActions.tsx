import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Ban } from 'lucide-react';

interface TableAction {
  type: 'view' | 'edit' | 'delete' | 'ban' | 'custom';
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface TableActionsProps {
  actions: TableAction[];
  className?: string;
}

const TableActions = ({ actions, className }: TableActionsProps) => {
  const getActionIcon = (type: TableAction['type']) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'edit':
        return <Edit className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'ban':
        return <Ban className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActionVariant = (type: TableAction['type']) => {
    switch (type) {
      case 'delete':
      case 'ban':
        return 'destructive' as const;
      default:
        return 'ghost' as const;
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || getActionVariant(action.type)}
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click when action is clicked
            action.onClick();
          }}
          title={action.label}
        >
          {action.icon || getActionIcon(action.type)}
        </Button>
      ))}
    </div>
  );
};

export default TableActions; 