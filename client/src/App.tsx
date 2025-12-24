import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Tools from "@/pages/Tools";
import RainfallTool from "@/pages/RainfallTool";
import RunoffTool from "@/pages/RunoffTool";
import DischargeTool from "@/pages/DischargeTool";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tools" component={Tools} />
      <Route path="/tools/rainfall" component={RainfallTool} />
      <Route path="/tools/runoff" component={RunoffTool} />
      <Route path="/tools/discharge" component={DischargeTool} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
