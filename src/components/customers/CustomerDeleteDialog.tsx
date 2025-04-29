
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Customer, useStore } from "@/lib/store";
import { toast } from "sonner";

interface CustomerDeleteDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomerDeleteDialog = ({
  customer,
  open,
  onOpenChange,
}: CustomerDeleteDialogProps) => {
  const { customers } = useStore();

  const handleDelete = () => {
    if (!customer) return;

    try {
      // Filter out the customer to delete
      useStore.setState({
        customers: customers.filter((c) => c.id !== customer.id),
      });

      toast.success("Customer deleted successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error("Error deleting customer:", error);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {customer.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDeleteDialog;
