
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/authStore';
import { toast } from 'sonner';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  User, 
  Settings, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Briefcase,
  Wallet,
  LogOut,
  Shield
} from 'lucide-react';
// import { GiRunningShoe}

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-gray-200", 
          open ? "justify-between" : "justify-center"
        )}>
          {open ? (
            <h1 className="text-lg font-semibold text-admin-primary">SprintGear</h1>
          ) : (
            <div className="w-8 h-8 bg-admin-primary rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-admin-primary"
          >
            {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            <NavItem to="/" icon={<Home size={18} />} label="Dashboard" open={open} />
            <NavItem to="/products" icon={<Package size={18} />} label="Products" open={open} />
            <NavItem to="/orders" icon={<ShoppingCart size={18} />} label="Orders" open={open} />
            <NavItem to="/vendors" icon={<Briefcase size={18} />} label="Vendors" open={open} />
            <NavItem to="/customers" icon={<User size={18} />} label="Customers" open={open} />
            <NavItem to="/users" icon={<Users size={18} />} label="User Management" open={open} />
            <NavItem to="/roles" icon={<Shield size={18} />} label="Role Management" open={open} />
            <NavItem to="/shipping" icon={<Tag size={18} />} label="Shipping" open={open} />
            <NavItem to="/payouts" icon={<Wallet size={18} />} label="Payouts" open={open} />
            <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" open={open} />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          {open ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-admin-primary/20 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-admin-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@shoebox.com'}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full"
              >
                <LogOut size={16} /> 
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 bg-admin-primary/20 rounded-full flex items-center justify-center">
                <Users size={16} className="text-admin-primary" />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="w-8 h-8"
                title="Logout"
              >
                <LogOut size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
}

function NavItem({ to, icon, label, open }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center py-2 px-3 rounded-md transition-colors group",
        isActive 
          ? "bg-admin-primary text-white" 
          : "text-gray-600 hover:bg-admin-primary/10 hover:text-admin-primary",
        !open && "justify-center"
      )}
      end={to === "/"}
    >
      <div className="flex items-center">
        {icon}
        {open && <span className="ml-3 text-sm font-medium">{label}</span>}
      </div>
    </NavLink>
  );
}
