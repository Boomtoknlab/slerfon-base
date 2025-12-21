import { Navigation } from "@/components/Navigation";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { motion } from "framer-motion";

export default function Airdrop() {
  const { isConnected, address } = useWallet();

  const { data: campaigns } = useQuery({
    queryKey: [api.airdrop.list.path],
    queryFn: async () => {
      const res = await fetch(api.airdrop.list.path);
      return api.airdrop.list.responses[200].parse(await res.json());
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <Gift className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4">Airdrop Checker</h1>
          <p className="text-xl text-muted-foreground">Verify your eligibility for $SLERF ecosystem rewards.</p>
        </motion.div>

        {!isConnected ? (
          <Card className="glass-card max-w-md w-full p-8 text-center border-dashed border-2 border-white/10">
            <p className="mb-6 text-muted-foreground">Connect your wallet to check eligibility.</p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Connect Wallet</Button>
          </Card>
        ) : (
          <div className="max-w-2xl w-full space-y-4">
            {campaigns?.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} address={address!} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CampaignCard({ campaign, address }: { campaign: any, address: string }) {
  // Mock logic: addresses ending in '2' are eligible
  const isEligible = address.endsWith('2');
  
  return (
    <Card className="glass-card border-l-4 border-l-blue-500 p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
      <div>
        <h3 className="text-xl font-bold mb-1">{campaign.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
        <div className="flex gap-2">
           <span className="text-xs bg-white/10 px-2 py-1 rounded">Total Pool: {Number(campaign.totalAmount).toLocaleString()}</span>
           <span className="text-xs bg-white/10 px-2 py-1 rounded capitalize">{campaign.status}</span>
        </div>
      </div>
      
      <div className="text-right">
        {isEligible ? (
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center text-green-400 font-bold">
              <CheckCircle className="w-5 h-5 mr-2" /> Eligible
            </div>
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">Claim Tokens</Button>
          </div>
        ) : (
          <div className="flex items-center text-red-400 font-medium opacity-80">
            <XCircle className="w-5 h-5 mr-2" /> Not Eligible
          </div>
        )}
      </div>
    </Card>
  );
}
