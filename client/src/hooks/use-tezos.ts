import { useQuery } from "@tanstack/react-query";
import { api, buildUrl, type TezosBlock, type TezosAccount, type TezosTransaction } from "@shared/routes";

// ============================================
// TEZOS DATA HOOKS
// ============================================

export function useTezosBlocks() {
  return useQuery({
    queryKey: [api.tezos.getBlocks.path],
    queryFn: async () => {
      const res = await fetch(api.tezos.getBlocks.path);
      if (!res.ok) throw new Error("Failed to fetch blocks");
      const data = await res.json();
      return api.tezos.getBlocks.responses[200].parse(data) as TezosBlock[];
    },
    refetchInterval: 15000, // Refresh every 15s (approx block time)
  });
}

export function useTezosTransactions() {
  return useQuery({
    queryKey: [api.tezos.getTransactions.path],
    queryFn: async () => {
      const res = await fetch(api.tezos.getTransactions.path);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      return api.tezos.getTransactions.responses[200].parse(data) as TezosTransaction[];
    },
    refetchInterval: 15000,
  });
}

export function useTezosAccount(address: string | null) {
  return useQuery({
    queryKey: [api.tezos.getAccount.path, address],
    queryFn: async () => {
      if (!address) return null;
      const url = buildUrl(api.tezos.getAccount.path, { address });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch account");
      const data = await res.json();
      return api.tezos.getAccount.responses[200].parse(data) as TezosAccount;
    },
    enabled: !!address, // Only run if address is provided
    retry: false,
  });
}
