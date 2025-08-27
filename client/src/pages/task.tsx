import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ArrowLeft, Info, MousePointer } from "lucide-react";
import { ClickConfirmationModal } from "@/components/click-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Task } from "@shared/schema";

export default function TaskPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [clickIndicators, setClickIndicators] = useState<Array<{x: number, y: number, id: string}>>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastClick, setLastClick] = useState<{x: number, y: number} | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: task, isLoading, error } = useQuery<Task>({
    queryKey: ["/api/tasks", id],
    enabled: !!id,
  });

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
    if (!task || !imageRef.current) return;

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
      taskId: task.id,
      x: newIndicator.x,
      y: newIndicator.y,
      userAgent: navigator.userAgent,
      sessionId
    });
  };

  const handleCompleteTask = () => {
    setShowConfirmation(false);
    toast({
      title: "Task completed!",
      description: "Thank you for your participation in the click test.",
    });
  };

  const handleRetryTask = () => {
    setShowConfirmation(false);
    setClickIndicators([]);
    setLastClick(null);
  };

  const handleResetTask = () => {
    setClickIndicators([]);
    setLastClick(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <MousePointer className="h-4 w-4 text-primary-foreground animate-pulse" />
          </div>
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The task you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!task.isActive) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Task Inactive</h2>
          <p className="text-muted-foreground mb-6">
            This task is currently paused and not accepting responses.
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MousePointer className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">ClickTest</h1>
            </div>
          </div>
          
          <Badge variant="secondary" data-testid="badge-single-task">
            Single Task
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Task Information */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground" data-testid="text-task-title">
            {task.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-task-description">
            {task.description}
          </p>
        </div>

        {/* Test Image Container */}
        <Card className="p-6">
          <div className="relative inline-block w-full">
            <img 
              ref={imageRef}
              src={task.imageUrl}
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
            </div>
          </div>
        </Card>

        {/* Click Confirmation Modal */}
        <ClickConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onNextTask={handleCompleteTask}
          onRetryTask={handleRetryTask}
          isLastTask={true}
        />
      </div>
    </div>
  );
}