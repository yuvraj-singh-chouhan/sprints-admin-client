
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Customer } from "@/lib/store";
import { formatDate } from "@/lib/utils";

interface CustomerDetailsDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomerDetailsDialog = ({
  customer,
  open,
  onOpenChange,
}: CustomerDetailsDialogProps) => {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Detailed information about {customer.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-sm capitalize">{customer.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Orders</p>
              <p className="text-sm">{customer.orders}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
              <p className="text-sm">${customer.totalSpent.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-sm">{customer.address}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p className="text-sm">{formatDate(customer.createdAt)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
