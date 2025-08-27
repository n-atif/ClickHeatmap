import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MousePointer, 
  Users, 
  ListTodo, 
  TrendingUp, 
  Plus, 
  Download, 
  FileText, 
  Code, 
  MoreVertical,
  Calendar,
  Maximize2
} from "lucide-react";
import { HeatmapViewer } from "./heatmap-viewer";
import type { Task, Click } from "@shared/schema";

interface Stats {
  totalClicks: number;
  totalTasks: number;
  activeTasks: number;
  uniqueTesters: number;
}

export function AdminDashboard() {
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: selectedTaskClicks = [] } = useQuery<Click[]>({
    queryKey: ["/api/clicks/task", selectedTaskId],
    enabled: !!selectedTaskId,
  });

  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  const handleExport = () => {
    if (!selectedTaskId) return;
    
    const url = `/api/export/clicks/${selectedTaskId}?format=${exportFormat}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `task-${selectedTaskId}-clicks.${exportFormat}`;
    link.click();
  };

  const successRate = selectedTaskClicks.length > 0 ? 
    Math.round((selectedTaskClicks.length / (stats?.uniqueTesters || 1)) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">Admin Dashboard</h1>
        <p className="text-muted-foreground">Analyze click testing results and manage tasks</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MousePointer className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold" data-testid="text-total-clicks">
                  {stats?.totalClicks || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <Users className="h-6 w-6 text-chart-2" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Testers</p>
                <p className="text-2xl font-bold" data-testid="text-unique-testers">
                  {stats?.uniqueTesters || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-chart-3/10 rounded-lg">
                <ListTodo className="h-6 w-6 text-chart-3" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold" data-testid="text-active-tasks">
                  {stats?.activeTasks || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-chart-4/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-chart-4" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold" data-testid="text-success-rate">
                  {successRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Task List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Tasks</CardTitle>
              <Button data-testid="button-add-task">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No tasks available</p>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-4 bg-accent rounded-lg"
                  data-testid={`card-task-${task.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-muted rounded border overflow-hidden">
                      <img 
                        src={task.imageUrl} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTaskClicks.length} clicks collected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={task.isActive ? "default" : "secondary"}>
                      {task.isActive ? "Active" : "Paused"}
                    </Badge>
                    <Button variant="ghost" size="icon" data-testid={`button-task-menu-${task.id}`}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Export & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Task</label>
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger data-testid="select-task">
                  <SelectValue placeholder="Choose a task..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={exportFormat === "csv" ? "default" : "outline"}
                  onClick={() => setExportFormat("csv")}
                  className="justify-start"
                  data-testid="button-format-csv"
                >
                  <FileText className="w-4 h-4 mr-2 text-chart-2" />
                  CSV Export
                </Button>
                <Button
                  variant={exportFormat === "json" ? "default" : "outline"}
                  onClick={() => setExportFormat("json")}
                  className="justify-start"
                  data-testid="button-format-json"
                >
                  <Code className="w-4 h-4 mr-2 text-chart-3" />
                  JSON Export
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <Button 
                className="w-full" 
                onClick={handleExport}
                disabled={!selectedTaskId}
                data-testid="button-download-data"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Click Heatmap Analysis</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm" data-testid="button-time-filter">
                <Calendar className="w-4 h-4 mr-2" />
                Last 7 days
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-expand-heatmap">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {selectedTask && selectedTaskClicks.length > 0 ? (
            <HeatmapViewer 
              task={selectedTask} 
              clicks={selectedTaskClicks} 
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {!selectedTaskId 
                  ? "Select a task to view click heatmap" 
                  : "No click data available for this task"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
