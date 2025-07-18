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
import { useUserRoleStore, User } from "@/lib/userRoleStore";
import { toast } from "sonner";

interface UserDeleteDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDeleteDialog = ({ user, open, onOpenChange }: UserDeleteDialogProps) => {
  const { deleteUser } = useUserRoleStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);
    
    try {
      await deleteUser(user.id);
      toast.success(`User ${user.firstName} ${user.lastName} deleted successfully!`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>? 
            This action cannot be undone and will permanently remove the user from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserDeleteDialog; 