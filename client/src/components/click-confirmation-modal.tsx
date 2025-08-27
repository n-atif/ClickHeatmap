import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ClickConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNextTask: () => void;
  onRetryTask: () => void;
  isLastTask?: boolean;
}

export function ClickConfirmationModal({
  isOpen,
  onClose,
  onNextTask,
  onRetryTask,
  isLastTask = false
}: ClickConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-click-confirmation">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold">Click Recorded!</DialogTitle>
          <DialogDescription>
            Thank you for your input. Your click has been successfully recorded for analysis.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex space-x-3 mt-6">
          <Button 
            onClick={onNextTask} 
            className="flex-1"
            data-testid="button-next-task"
          >
            {isLastTask ? "Complete Test" : "Next Task"}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onRetryTask} 
            className="flex-1"
            data-testid="button-retry-task"
          >
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
