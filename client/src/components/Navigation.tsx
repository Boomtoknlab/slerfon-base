import { Link, useLocation } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Coins, Vote, Image as ImageIcon, Gift, Wallet } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  const { isConnected, address, connect, disconnect } = useWallet();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Staking", href: "/staking", icon: Coins },
    { label: "Governance", href: "/governance", icon: Vote },
    { label: "Memes", href: "/memes", icon: ImageIcon },
    { label: "Airdrop", href: "/airdrop", icon: Gift },
  ];

  const NavLink = ({ item, mobile = false }: { item: typeof navItems[0], mobile?: boolean }) => {
    const isActive = location === item.href;
    const Icon = item.icon;
    
    return (
      <Link href={item.href} className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium",
        isActive 
          ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-primary/20" 
          : "text-muted-foreground hover:text-foreground hover:bg-white/5",
        mobile && "w-full text-lg py-4"
      )}>
        <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            {/* Simple Logo Placeholder */}
            <span className="text-2xl">🦥</span>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">
            Slerf<span className="text-primary">Base</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        {/* Wallet Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={isConnected ? disconnect : connect}
            className={cn(
              "font-semibold rounded-xl px-6 py-2 transition-all duration-300",
              isConnected 
                ? "bg-secondary hover:bg-destructive hover:text-destructive-foreground border border-white/10" 
                : "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:-translate-y-0.5"
            )}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isConnected ? address : "Connect Wallet"}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-l border-white/10">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <NavLink key={item.href} item={item} mobile />
                ))}
                <div className="h-px bg-white/10 my-4" />
                <Button
                  onClick={isConnected ? disconnect : connect}
                  className="w-full"
                  variant={isConnected ? "outline" : "default"}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnected ? address : "Connect Wallet"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
