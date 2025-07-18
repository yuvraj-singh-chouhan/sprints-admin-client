import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserStatus } from "@/lib/userRoleStore";
import { 
  Shield, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  User as UserIcon,
  MapPin,
  Building,
  Star,
  Activity,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDetailsDialog = ({ user, open, onOpenChange }: UserDetailsDialogProps) => {
  if (!user) return null;

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'suspended':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return formatDate(lastLogin);
    }
  };

  const getAccountAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 30) {
      return `${diffInDays} days`;
    } else if (diffInDays < 365) {
      return `${Math.floor(diffInDays / 30)} months`;
    } else {
      return `${Math.floor(diffInDays / 365)} years`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
          <DialogDescription>
            Complete information about the user and their role permissions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Profile Header */}
          <Card className="border-l-4 border-l-admin-primary">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20 ring-2 ring-admin-primary/20">
                  <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="text-xl bg-admin-primary/10 text-admin-primary font-bold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={getStatusBadgeVariant(user.status)}
                      className={cn("px-3 py-1", getStatusColor(user.status))}
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      {user.status}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {getAccountAge(user.createdAt)} old
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-admin-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 group">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-admin-primary transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900 truncate">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-start space-x-3 group">
                      <Phone className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-admin-primary transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.department && (
                    <div className="flex items-start space-x-3 group">
                      <Building className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-admin-primary transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">Department</p>
                        <p className="text-sm text-gray-900">{user.department}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Role Information */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-admin-primary" />
                  Role & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-admin-primary/5 rounded-lg border border-admin-primary/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-admin-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-admin-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {user.role.name}
                        {user.role.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {user.role.description}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Permissions</span>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {user.role.permissions.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-admin-primary" />
                Activity & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Last Login</span>
                  </div>
                  <p className="text-lg font-semibold">{formatLastLogin(user.lastLogin)}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.lastLogin ? 'Active user' : 'Hasn\'t logged in yet'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Account Created</span>
                  </div>
                  <p className="text-lg font-semibold">{formatDate(user.createdAt)}</p>
                  <p className="text-xs text-muted-foreground">
                    {getAccountAge(user.createdAt)} ago
                  </p>
                </div>

                {user.updatedAt !== user.createdAt && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Last Updated</span>
                    </div>
                    <p className="text-lg font-semibold">{formatDate(user.updatedAt)}</p>
                    <p className="text-xs text-muted-foreground">
                      Profile was modified
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics (Mock Data) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-admin-primary" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-blue-600">Login Success Rate</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">24</div>
                  <div className="text-sm text-green-600">Sessions This Month</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.role.permissions.length}
                  </div>
                  <div className="text-sm text-purple-600">Active Permissions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog; 