import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { type InsertSubmission } from "@shared/schema";

export function useMemeSubmissions() {
  return useQuery({
    queryKey: [api.memeContest.list.path],
    queryFn: async () => {
      const res = await fetch(api.memeContest.list.path);
      if (!res.ok) throw new Error("Failed to fetch memes");
      return api.memeContest.list.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitMeme() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const res = await fetch(api.memeContest.submit.path, {
        method: api.memeContest.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit meme");
      return api.memeContest.submit.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.memeContest.list.path] });
      toast({
        title: "Meme Submitted!",
        description: "Good luck in the contest!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not submit meme. Try again.",
        variant: "destructive",
      });
    },
  });
}
