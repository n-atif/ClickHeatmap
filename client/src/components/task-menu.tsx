import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Pause, Play, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Task } from "@shared/schema";

interface TaskMenuProps {
  task: Task;
}

export function TaskMenu({ task }: TaskMenuProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleTaskMutation = useMutation({
    mutationFn: async (isActive: number) => {
      return apiRequest("PATCH", `/api/tasks/${task.id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Task Updated",
        description: `Task ${task.isActive ? "paused" : "activated"} successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Task Deleted",
        description: "Task and all associated click data removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    },
  });

  const handleToggleStatus = () => {
    const newStatus = task.isActive ? 0 : 1;
    toggleTaskMutation.mutate(newStatus);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      deleteTaskMutation.mutate();
    }
  };

  const handleCopyUrl = () => {
    const taskUrl = `${window.location.origin}/?task=${task.id}`;
    navigator.clipboard.writeText(taskUrl);
    toast({
      title: "URL Copied",
      description: "Task URL copied to clipboard.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          data-testid={`button-task-menu-${task.id}`}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={handleCopyUrl}
          data-testid={`menu-copy-url-${task.id}`}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Task URL
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleToggleStatus}
          disabled={toggleTaskMutation.isPending}
          data-testid={`menu-toggle-status-${task.id}`}
        >
          {task.isActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause Task
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Activate Task
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem disabled data-testid={`menu-edit-${task.id}`}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Task
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleDelete}
          disabled={deleteTaskMutation.isPending}
          className="text-destructive focus:text-destructive"
          data-testid={`menu-delete-${task.id}`}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}