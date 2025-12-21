import { Navigation } from "@/components/Navigation";
import { useProposals, useCreateProposal, useVoteProposal } from "@/hooks/use-governance";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Plus, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const proposalSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

export default function Governance() {
  const { data: proposals, isLoading } = useProposals();
  const { isConnected } = useWallet();
  const [open, setOpen] = useState(false);
  
  const createMutation = useCreateProposal();
  
  const form = useForm<z.infer<typeof proposalSchema>>({
    resolver: zodResolver(proposalSchema),
    defaultValues: { title: "", description: "" },
  });

  const onSubmit = (values: z.infer<typeof proposalSchema>) => {
    // Mock end time 7 days from now
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 7);
    
    createMutation.mutate({
      ...values,
      endTime: endTime.toISOString() as unknown as Date, // Handling string/date mismatch for demo
    }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-purple-900/10 via-background to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Governance</h1>
            <p className="text-muted-foreground">Vote on proposals to shape the future.</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={!isConnected} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" /> Create Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10">
              <DialogHeader>
                <DialogTitle>Create New Proposal</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Increase staking rewards" className="bg-secondary/50 border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Explain your proposal in detail..." 
                            className="bg-secondary/50 border-white/10 min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Submit Proposal"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading proposals...</div>
          ) : proposals?.length === 0 ? (
            <div className="text-center py-20 bg-card/30 rounded-2xl border border-white/5">
              <p className="text-lg font-medium">No proposals yet.</p>
              <p className="text-muted-foreground">Be the first to create one!</p>
            </div>
          ) : (
            proposals?.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function ProposalCard({ proposal }: { proposal: any }) {
  const { isConnected } = useWallet();
  const voteMutation = useVoteProposal();
  
  const totalVotes = (proposal.votesFor || 0) + (proposal.votesAgainst || 0);
  const forPercentage = totalVotes > 0 ? ((proposal.votesFor || 0) / totalVotes) * 100 : 0;
  
  const timeLeft = new Date(proposal.endTime) > new Date();

  return (
    <Card className="glass-card hover:border-white/20 transition-all">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'} className={cn(
              proposal.status === 'active' ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : ""
            )}>
              {proposal.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Ends {format(new Date(proposal.endTime), "MMM d, yyyy")}
            </span>
          </div>
          <CardTitle className="text-2xl font-display">{proposal.title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          {proposal.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-green-400">For: {proposal.votesFor}</span>
            <span className="text-red-400">Against: {proposal.votesAgainst}</span>
          </div>
          <Progress value={forPercentage} className="h-2 bg-red-500/20" indicatorClassName="bg-green-500" />
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-white/5 pt-6 gap-4">
        <Button 
          variant="outline" 
          className="flex-1 gap-2 border-green-500/20 hover:bg-green-500/10 hover:text-green-400"
          disabled={!isConnected || !timeLeft || voteMutation.isPending}
          onClick={() => voteMutation.mutate({ id: proposal.id, support: true })}
        >
          <ThumbsUp className="w-4 h-4" /> Vote For
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 gap-2 border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
          disabled={!isConnected || !timeLeft || voteMutation.isPending}
          onClick={() => voteMutation.mutate({ id: proposal.id, support: false })}
        >
          <ThumbsDown className="w-4 h-4" /> Vote Against
        </Button>
      </CardFooter>
    </Card>
  );
}
