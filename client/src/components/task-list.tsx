import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MousePointer, ExternalLink, Users, Calendar } from "lucide-react";
import type { Task, Click } from "@shared/schema";

export function TaskList() {
  const [, setLocation] = useLocation();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: allClicks = [] } = useQuery<Click[]>({
    queryKey: ["/api/clicks"],
  });

  const activeTasks = tasks.filter(task => task.isActive === 1);

  const getClickCountForTask = (taskId: string) => {
    return allClicks.filter(click => click.taskId === taskId).length;
  };

  const getUniqueTestersForTask = (taskId: string) => {
    const taskClicks = allClicks.filter(click => click.taskId === taskId);
    return new Set(taskClicks.map(click => click.sessionId).filter(Boolean)).size;
  };

  const handleStartTask = (taskId: string) => {
    setLocation(`/task/${taskId}`);
  };

  const copyTaskUrl = (taskId: string) => {
    const taskUrl = `${window.location.origin}/task/${taskId}`;
    navigator.clipboard.writeText(taskUrl);
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
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Available Click Tests</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose a task to participate in user experience testing. Each test helps improve interface design.
        </p>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTasks.map((task) => {
          const clickCount = getClickCountForTask(task.id);
          const testerCount = getUniqueTestersForTask(task.id);
          
          return (
            <Card key={task.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-task-${task.id}`}>
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img 
                  src={task.imageUrl}
                  alt={task.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                    Active
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MousePointer className="w-4 h-4 mr-1" />
                    <span>{clickCount} clicks</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{testerCount} testers</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleStartTask(task.id)}
                    className="flex-1"
                    data-testid={`button-start-task-${task.id}`}
                  >
                    <MousePointer className="w-4 h-4 mr-2" />
                    Start Test
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyTaskUrl(task.id)}
                    data-testid={`button-copy-link-${task.id}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-12">
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MousePointer className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">How Click Testing Works</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click "Start Test" to begin a specific task</li>
                  <li>• Click anywhere on the image where you think the action should happen</li>
                  <li>• Your response helps improve user interface design</li>
                  <li>• Each task can be shared individually with different users</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}