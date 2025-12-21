import { Navigation } from "@/components/Navigation";
import { useStakingPools, useUserStakes, useStakeTokens } from "@/hooks/use-staking";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Lock, Timer, Wallet, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const stakeSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
});

export default function Staking() {
  const { data: pools, isLoading } = useStakingPools();
  const { isConnected, userId } = useWallet();
  const { data: myStakes } = useUserStakes(userId ?? undefined);
  
  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Staking Pools</h1>
            <p className="text-muted-foreground">Lock your SLERF to earn juicy rewards.</p>
          </div>
          
          {isConnected && (
            <div className="bg-card/50 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md">
              <p className="text-sm text-muted-foreground mb-1">Total Staked</p>
              <p className="text-2xl font-bold text-primary">
                {myStakes?.reduce((acc, s) => acc + Number(s.amount), 0).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">SLERF</span>
              </p>
            </div>
          )}
        </div>

        <Tabs defaultValue="pools" className="space-y-8">
          <TabsList className="bg-card/50 p-1 border border-white/5 rounded-xl">
            <TabsTrigger value="pools" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Active Pools</TabsTrigger>
            <TabsTrigger value="my-stakes" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" disabled={!isConnected}>My Stakes</TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-20 text-muted-foreground">Loading pools...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pools?.map((pool) => (
                  <PoolCard key={pool.id} pool={pool} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-stakes">
             <div className="glass-card rounded-2xl overflow-hidden">
               <div className="p-6 border-b border-white/5">
                 <h3 className="text-xl font-bold">Your Active Stakes</h3>
               </div>
               {myStakes?.length === 0 ? (
                 <div className="p-12 text-center text-muted-foreground">
                   You haven't staked any tokens yet.
                 </div>
               ) : (
                 <div className="divide-y divide-white/5">
                   {myStakes?.map((stake) => (
                     <div key={stake.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                           <Lock className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="font-bold text-lg">{Number(stake.amount).toLocaleString()} SLERF</p>
                           <p className="text-sm text-muted-foreground">Staked on {new Date(stake.startTime!).toLocaleDateString()}</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/20">
                           Active
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PoolCard({ pool }: { pool: any }) {
  const { isConnected, userId } = useWallet();
  const stakeMutation = useStakeTokens();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof stakeSchema>>({
    resolver: zodResolver(stakeSchema),
    defaultValues: { amount: "" },
  });

  const onSubmit = (values: z.infer<typeof stakeSchema>) => {
    if (!userId) return;
    stakeMutation.mutate({
      poolId: pool.id,
      userId,
      amount: values.amount,
    }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Card className="glass-card flex flex-col h-full border-t-4 border-t-primary/50 transition-all hover:border-t-primary hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-2xl font-display">{pool.name}</CardTitle>
          <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold">
            {pool.apy}% APY
          </div>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Timer className="w-4 h-4" /> {pool.lockPeriodDays} Day Lock
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Min Stake</span>
            <span className="font-mono">{Number(pool.minStake).toLocaleString()} SLERF</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Staked</span>
            <span className="font-mono">{Number(pool.totalStaked).toLocaleString()} SLERF</span>
          </div>
          
          <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-3/4 rounded-full" />
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full font-bold shadow-lg shadow-primary/10" 
              disabled={!isConnected}
            >
              {isConnected ? "Stake Now" : "Connect Wallet to Stake"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-white/10 text-foreground">
            <DialogHeader>
              <DialogTitle>Stake in {pool.name}</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Stake</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="0.00" 
                              className="pr-16 text-lg font-mono bg-secondary/50 border-white/10 focus-visible:ring-primary" 
                              {...field} 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">SLERF</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-blue-500/10 p-4 rounded-lg flex gap-3 items-start border border-blue-500/20">
                    <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-300">
                      Your tokens will be locked for {pool.lockPeriodDays} days. Early unstaking incurs a 25% penalty fee.
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={stakeMutation.isPending}
                  >
                    {stakeMutation.isPending ? "Confirming..." : "Confirm Stake"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
