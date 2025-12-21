import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { type InsertStake } from "@shared/schema";

export function useStakingPools() {
  return useQuery({
    queryKey: [api.staking.pools.path],
    queryFn: async () => {
      const res = await fetch(api.staking.pools.path);
      if (!res.ok) throw new Error("Failed to fetch pools");
      return api.staking.pools.responses[200].parse(await res.json());
    },
  });
}

export function useUserStakes(userId?: number) {
  return useQuery({
    queryKey: [api.staking.userStakes.path, userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      const url = buildUrl(api.staking.userStakes.path, { userId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch user stakes");
      return api.staking.userStakes.responses[200].parse(await res.json());
    },
  });
}

export function useStakeTokens() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertStake) => {
      const res = await fetch(api.staking.stake.path, {
        method: api.staking.stake.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to stake tokens");
      }
      
      return api.staking.stake.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.staking.userStakes.path, variables.userId] });
      toast({
        title: "Staking Successful",
        description: "Your tokens have been staked successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Staking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
