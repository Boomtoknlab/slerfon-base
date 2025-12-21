import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

export function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  return (
    <Card className="bg-card/40 border-white/5 backdrop-blur-sm overflow-hidden hover:bg-card/60 transition-colors group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-display font-bold text-white group-hover:scale-105 transition-transform origin-left">
              {value}
            </h3>
            {change && (
              <p className={cn(
                "text-sm font-medium flex items-center gap-1",
                trend === 'up' ? "text-green-400" : "text-red-400"
              )}>
                {change}
                <span className="text-xs text-muted-foreground ml-1">24h</span>
              </p>
            )}
          </div>
          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/20 group-hover:text-primary transition-colors text-white/60">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
