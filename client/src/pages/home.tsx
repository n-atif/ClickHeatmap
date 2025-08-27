import { useState } from "react";
import { TestingInterface } from "@/components/testing-interface";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Button } from "@/components/ui/button";
import { MousePointer, Settings } from "lucide-react";

export default function Home() {
  const [currentMode, setCurrentMode] = useState<"test" | "admin">("test");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MousePointer className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">ClickTest</h1>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button
              data-testid="button-test-mode"
              variant={currentMode === "test" ? "default" : "ghost"}
              onClick={() => setCurrentMode("test")}
            >
              Test Mode
            </Button>
            <Button
              data-testid="button-admin-mode"
              variant={currentMode === "admin" ? "default" : "ghost"}
              onClick={() => setCurrentMode("admin")}
            >
              Admin
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-settings">
              <Settings className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      {currentMode === "test" ? <TestingInterface /> : <AdminDashboard />}
    </div>
  );
}
