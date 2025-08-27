import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, SkipForward, ClipboardList, Info } from "lucide-react";
import { ClickConfirmationModal } from "./click-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Task, Click } from "@shared/schema";

export function TestingInterface() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [clickIndicators, setClickIndicators] = useState<Array<{x: number, y: number, id: string}>>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastClick, setLastClick] = useState<{x: number, y: number} | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const currentTask = tasks[currentTaskIndex];
  const activeTasks = tasks.filter(task => task.isActive === 1);

  const recordClickMutation = useMutation({
    mutationFn: async (clickData: { taskId: string; x: number; y: number; userAgent?: string; sessionId?: string }) => {
      return apiRequest("POST", "/api/clicks", clickData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clicks"] });
      setShowConfirmation(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record click. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!currentTask || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Add visual indicator
    const newIndicator = {
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setClickIndicators([newIndicator]);
    setLastClick({ x: newIndicator.x, y: newIndicator.y });

    // Generate session ID if not exists
    let sessionId = localStorage.getItem('clicktest-session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('clicktest-session', sessionId);
    }

    recordClickMutation.mutate({
      taskId: currentTask.id,
      x: newIndicator.x,
      y: newIndicator.y,
      userAgent: navigator.userAgent,
      sessionId
    });
  };

  const handleNextTask = () => {
    setShowConfirmation(false);
    setClickIndicators([]);
    setLastClick(null);
    
    if (currentTaskIndex < activeTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      toast({
        title: "All tasks completed!",
        description: "Thank you for your participation in the click test.",
      });
      setCurrentTaskIndex(0);
    }
  };

  const handleRetryTask = () => {
    setShowConfirmation(false);
    setClickIndicators([]);
    setLastClick(null);
  };

  const handleSkipTask = () => {
    setClickIndicators([]);
    setLastClick(null);
    
    if (currentTaskIndex < activeTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      setCurrentTaskIndex(0);
    }
  };

  const handleResetTask = () => {
    setClickIndicators([]);
    setLastClick(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">Loading tasks...</div>
      </div>
    );
  }

  if (activeTasks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Active Tasks</h2>
          <p className="text-muted-foreground">There are currently no active click tests available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Task Information */}
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-4" data-testid="badge-task-progress">
          <ClipboardList className="w-4 h-4 mr-2" />
          Task {currentTaskIndex + 1} of {activeTasks.length}
        </Badge>
        
        <h2 className="text-3xl font-bold mb-4 text-foreground" data-testid="text-task-title">
          {currentTask?.title}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-task-description">
          {currentTask?.description}
        </p>
      </div>

      {/* Test Image Container */}
      <Card className="p-6">
        <div className="relative inline-block w-full">
          <img 
            ref={imageRef}
            src={currentTask?.imageUrl}
            alt="Test interface"
            className="w-full h-auto rounded-lg shadow-md cursor-crosshair select-none"
            onClick={handleImageClick}
            data-testid="img-test-image"
          />
          
          {/* Click indicators */}
          {clickIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className="absolute w-3 h-3 bg-primary border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse z-10"
              style={{
                left: `${indicator.x}%`,
                top: `${indicator.y}%`,
              }}
              data-testid={`indicator-click-${indicator.id}`}
            />
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Click anywhere on the image to complete the task
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleResetTask}
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleSkipTask}
              data-testid="button-skip"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Task
            </Button>
          </div>
        </div>
      </Card>

      {/* Progress Indicator */}
      <div className="mt-8 flex items-center justify-center space-x-4">
        <div className="flex space-x-2" data-testid="progress-indicators">
          {activeTasks.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentTaskIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Click Confirmation Modal */}
      <ClickConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onNextTask={handleNextTask}
        onRetryTask={handleRetryTask}
        isLastTask={currentTaskIndex === activeTasks.length - 1}
      />
    </div>
  );
}
