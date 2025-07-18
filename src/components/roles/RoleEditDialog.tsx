import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useUserRoleStore, Role, Permission } from "@/lib/userRoleStore";
import { toast } from "sonner";

interface RoleEditDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RoleFormData {
  name: string;
  description: string;
  selectedPermissions: string[];
}

const RoleEditDialog = ({ role, open, onOpenChange }: RoleEditDialogProps) => {
  const { permissions, updateRole } = useUserRoleStore();
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    selectedPermissions: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        selectedPermissions: role.permissions.map(p => p.id),
      });
    }
  }, [role]);

  const handleChange = (field: keyof Omit<RoleFormData, 'selectedPermissions'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: checked
        ? [...prev.selectedPermissions, permissionId]
        : prev.selectedPermissions.filter(id => id !== permissionId)
    }));
  };

  const handleModulePermissionChange = (modulePermissions: Permission[], checked: boolean) => {
    const modulePermissionIds = modulePermissions.map(p => p.id);
    setFormData(prev => ({
      ...prev,
      selectedPermissions: checked
        ? [...new Set([...prev.selectedPermissions, ...modulePermissionIds])]
        : prev.selectedPermissions.filter(id => !modulePermissionIds.includes(id))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) return;

    // Validation
    if (!formData.name.trim()) {
      toast.error("Role name is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Role description is required");
      return;
    }
    
    if (formData.selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    const selectedPermissionObjects = permissions.filter(p => 
      formData.selectedPermissions.includes(p.id)
    );

    setIsSubmitting(true);
    
    try {
      await updateRole(role.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        permissions: selectedPermissionObjects,
      });

      toast.success("Role updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update role");
      console.error("Error updating role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
    }
  };

  if (!role) return null;

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const isModuleFullySelected = (modulePermissions: Permission[]) => {
    return modulePermissions.every(p => formData.selectedPermissions.includes(p.id));
  };

  const isModulePartiallySelected = (modulePermissions: Permission[]) => {
    return modulePermissions.some(p => formData.selectedPermissions.includes(p.id)) &&
           !isModuleFullySelected(modulePermissions);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Role
            {role.isDefault && (
              <Badge variant="secondary" className="text-xs">
                Default
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Update role information and modify permissions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Role Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Enter role name"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="col-span-3"
                placeholder="Describe the role and its responsibilities"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-medium">Permissions *</Label>
            
            <ScrollArea className="h-96 w-full border rounded-md p-4">
              <div className="space-y-6">
                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                  <div key={module} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`module-${module}`}
                        checked={isModuleFullySelected(modulePermissions)}
                        onCheckedChange={(checked) => handleModulePermissionChange(modulePermissions, checked as boolean)}
                        className={isModulePartiallySelected(modulePermissions) ? "data-[state=checked]:bg-amber-500" : ""}
                        disabled={isSubmitting}
                      />
                      <Label 
                        htmlFor={`module-${module}`} 
                        className="text-sm font-medium capitalize cursor-pointer"
                      >
                        {module} {isModulePartiallySelected(modulePermissions) && '(Partial)'}
                      </Label>
                    </div>
                    
                    <div className="ml-6 space-y-2">
                      {modulePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={formData.selectedPermissions.includes(permission.id)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                            disabled={isSubmitting}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label 
                              htmlFor={permission.id}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {permission.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <p className="text-xs text-muted-foreground">
              Selected {formData.selectedPermissions.length} of {permissions.length} permissions
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-admin-primary hover:bg-admin-primary-hover"
            >
              {isSubmitting ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleEditDialog; 