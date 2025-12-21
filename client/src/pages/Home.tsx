import { Navigation } from "@/components/Navigation";
import { StatsCard } from "@/components/StatsCard";
import { DollarSign, Activity, Users, Zap, ArrowRight, Vote, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-background to-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-32 pb-12">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold animate-pulse">
              🚀 Slerf is now live on Base Chain!
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              The Slowest Way to <br />
              <span className="text-gradient">Get Rich Fast</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the laziest community in crypto. Stake tokens, vote on memes, and earn rewards without lifting more than a finger.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/staking">
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all">
                  Start Staking
                </Button>
              </Link>
              <Link href="/memes">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/10 hover:bg-white/5 backdrop-blur-sm">
                  View Memes
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Stats Grid */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsCard 
            title="Current Price" 
            value="$0.42069" 
            change="+12.5%" 
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <StatsCard 
            title="Market Cap" 
            value="$69.4M" 
            change="+5.2%" 
            trend="up"
            icon={<Activity className="w-6 h-6" />}
          />
          <StatsCard 
            title="Total Stakers" 
            value="12,405" 
            change="+142" 
            trend="up"
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard 
            title="Total Value Locked" 
            value="$8.2M" 
            change="-0.4%" 
            trend="down"
            icon={<Zap className="w-6 h-6" />}
          />
        </motion.section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-display">Yield Staking</h3>
            <p className="text-muted-foreground mb-6">Lock your tokens to earn high APY rewards. The longer you sleep (stake), the more you earn.</p>
            <Link href="/staking" className="inline-flex items-center text-primary font-medium hover:underline">
              Go to Pools <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
              <Vote className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-display">Community Governance</h3>
            <p className="text-muted-foreground mb-6">Your voice matters. Vote on proposals to decide the future of the laziest ecosystem.</p>
            <Link href="/governance" className="inline-flex items-center text-purple-400 font-medium hover:underline">
              Vote Now <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-display">Airdrops & Rewards</h3>
            <p className="text-muted-foreground mb-6">Check your eligibility for ongoing airdrop campaigns. Free tokens for doing absolutely nothing.</p>
            <Link href="/airdrop" className="inline-flex items-center text-blue-400 font-medium hover:underline">
              Check Eligibility <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

// Helper icon component
function Coins({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}
