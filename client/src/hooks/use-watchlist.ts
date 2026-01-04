import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertWatchedAddress } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useWatchlist() {
  return useQuery({
    queryKey: [api.watchlist.list.path],
    queryFn: async () => {
      const res = await fetch(api.watchlist.list.path);
      if (!res.ok) throw new Error("Failed to fetch watchlist");
      return api.watchlist.list.responses[200].parse(await res.json());
    },
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertWatchedAddress) => {
      const validated = api.watchlist.create.input.parse(data);
      const res = await fetch(api.watchlist.create.path, {
        method: api.watchlist.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.watchlist.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to add to watchlist");
      }
      return api.watchlist.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.watchlist.list.path] });
      toast({
        title: "Address added",
        description: "Successfully added address to your watchlist.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.watchlist.delete.path, { id });
      const res = await fetch(url, { method: api.watchlist.delete.method });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Item not found");
        throw new Error("Failed to remove item");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.watchlist.list.path] });
      toast({
        title: "Address removed",
        description: "Removed address from your watchlist.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
