import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserRoleStore, Role } from "@/lib/userRoleStore";
import { toast } from "sonner";

interface RoleDeleteDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoleDeleteDialog = ({ role, open, onOpenChange }: RoleDeleteDialogProps) => {
  const { deleteRole } = useUserRoleStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!role) return;

    setIsDeleting(true);
    
    try {
      await deleteRole(role.id);
      toast.success(`Role "${role.name}" deleted successfully!`);
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete role";
      toast.error(errorMessage);
      console.error("Error deleting role:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!role) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the role <strong>"{role.name}"</strong>? 
            <br /><br />
            This action cannot be undone and will permanently remove the role from the system.
            {role.isDefault && (
              <span className="block mt-2 text-destructive font-medium">
                Warning: This is a default role and cannot be deleted.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting || role.isDefault}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Role"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoleDeleteDialog; 