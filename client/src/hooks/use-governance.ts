import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { type InsertProposal } from "@shared/schema";

export function useProposals() {
  return useQuery({
    queryKey: [api.governance.list.path],
    queryFn: async () => {
      const res = await fetch(api.governance.list.path);
      if (!res.ok) throw new Error("Failed to fetch proposals");
      return api.governance.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertProposal) => {
      const res = await fetch(api.governance.create.path, {
        method: api.governance.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create proposal");
      }

      return api.governance.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.governance.list.path] });
      toast({
        title: "Proposal Created",
        description: "Your proposal is now live for voting.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useVoteProposal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, support }: { id: number; support: boolean }) => {
      const url = buildUrl(api.governance.vote.path, { id });
      const res = await fetch(url, {
        method: api.governance.vote.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ support }),
      });

      if (!res.ok) throw new Error("Failed to vote");
      return api.governance.vote.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.governance.list.path] });
      toast({
        title: "Vote Cast",
        description: "Your vote has been recorded on-chain.",
      });
    },
  });
}
