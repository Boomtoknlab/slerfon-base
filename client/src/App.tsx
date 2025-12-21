import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Staking from "@/pages/Staking";
import Governance from "@/pages/Governance";
import MemeContest from "@/pages/MemeContest";
import Airdrop from "@/pages/Airdrop";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/staking" component={Staking} />
      <Route path="/governance" component={Governance} />
      <Route path="/memes" component={MemeContest} />
      <Route path="/airdrop" component={Airdrop} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
