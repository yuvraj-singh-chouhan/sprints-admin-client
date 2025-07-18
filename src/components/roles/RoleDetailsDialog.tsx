import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Role, Permission } from "@/lib/userRoleStore";
import { Shield, Calendar, User, CheckCircle } from "lucide-react";

interface RoleDetailsDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoleDetailsDialog = ({ role, open, onOpenChange }: RoleDetailsDialogProps) => {
  if (!role) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group permissions by module
  const permissionsByModule = role.permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-admin-primary" />
            Role Details
          </DialogTitle>
          <DialogDescription>
            Complete information about the role and its permissions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Role Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{role.name}</h3>
              <div className="flex gap-2">
                {role.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default Role
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {role.permissions.length} Permission{role.permissions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {role.description}
            </p>
          </div>

          <Separator />

          {/* Permissions Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Permissions by Module
            </h4>
            
            <ScrollArea className="h-80 w-full border rounded-md p-4">
              <div className="space-y-6">
                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                  <div key={module} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-admin-primary" />
                      <h5 className="font-medium capitalize">{module}</h5>
                      <Badge variant="outline" className="text-xs">
                        {modulePermissions.length} permission{modulePermissions.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <div className="ml-6 space-y-2">
                      {modulePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{permission.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {permission.action}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {role.permissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No permissions assigned to this role</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Meta Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Role Information
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="text-muted-foreground">Created:</span> {formatDate(role.createdAt)}
                </div>
              </div>
              
              {role.updatedAt !== role.createdAt && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Updated:</span> {formatDate(role.updatedAt)}
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="text-muted-foreground">Created by:</span> {role.createdBy}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDetailsDialog; 