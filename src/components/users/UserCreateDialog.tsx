import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserRoleStore, UserStatus } from "@/lib/userRoleStore";
import { toast } from "sonner";

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: UserStatus;
  roleId: string;
}

const UserCreateDialog = ({ open, onOpenChange }: UserCreateDialogProps) => {
  const { roles, createUser } = useUserRoleStore();
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
    roleId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (!formData.roleId) {
      toast.error("Please select a role");
      return;
    }

    const selectedRole = roles.find(role => role.id === formData.roleId);
    if (!selectedRole) {
      toast.error("Selected role not found");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        status: formData.status,
        role: selectedRole,
      });

      toast.success("User created successfully!");
      onOpenChange(false);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        status: "active",
        roleId: "",
      });
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Error creating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Reset form when dialog closes
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          status: "active",
          roleId: "",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system with their role and permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="col-span-3"
                placeholder="Enter first name"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="col-span-3"
                placeholder="Enter last name"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3"
                placeholder="Enter email address"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="col-span-3"
                placeholder="Enter phone number"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role *
              </Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) => handleChange("roleId", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value as UserStatus)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateDialog; 