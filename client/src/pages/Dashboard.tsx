import { useTezosBlocks, useTezosTransactions } from "@/hooks/use-tezos";
import { Layout } from "@/components/Layout";
import { DataCard } from "@/components/DataCard";
import { Box, Activity, Clock, Server, ArrowRightLeft, Hash } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: blocks, isLoading: loadingBlocks, error: blocksError } = useTezosBlocks();
  const { data: txs, isLoading: loadingTxs } = useTezosTransactions();

  if (blocksError) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="bg-destructive/10 p-4 rounded-full mb-4">
            <Server className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Connection Failed</h2>
          <p className="text-muted-foreground max-w-md">
            Could not connect to the Tezos node. Please ensure the backend proxy is running correctly.
          </p>
        </div>
      </Layout>
    );
  }

  const latestBlock = blocks?.[0];
  const tps = txs ? (txs.length / 15).toFixed(2) : "0.00"; // Rough estimate based on recent fetch

  return (
    <Layout>
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Network Overview</h1>
        <p className="text-muted-foreground">Real-time status of the Tezos Mainnet</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DataCard 
          title="Current Level" 
          value={latestBlock?.level.toLocaleString() || "Loading..."} 
          subtitle="Latest Block Height"
          icon={Box}
          variant="primary"
        />
        <DataCard 
          title="Latest Hash" 
          value={latestBlock ? `${latestBlock.hash.slice(0, 8)}...` : "Loading..."} 
          subtitle="Block Identifier"
          icon={Hash}
        />
        <DataCard 
          title="Recent Transactions" 
          value={txs?.length || 0} 
          subtitle={`Approx ${tps} TPS`}
          icon={Activity}
          variant="accent"
        />
        <DataCard 
          title="Last Update" 
          value={latestBlock ? format(new Date(latestBlock.timestamp), "HH:mm:ss") : "--:--:--"} 
          subtitle="Block Time"
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Blocks */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Box className="w-5 h-5 text-primary" />
              Recent Blocks
            </h2>
            <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium animate-pulse">
              LIVE
            </div>
          </div>
          <div className="divide-y divide-border">
            {loadingBlocks ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 animate-pulse flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-3 w-48 bg-muted rounded"></div>
                  </div>
                  <div className="h-8 w-8 bg-muted rounded-full"></div>
                </div>
              ))
            ) : (
              blocks?.slice(0, 5).map((block, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={block.hash} 
                  className="p-4 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-primary font-medium">#{block.level}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(block.timestamp), "MMM d, HH:mm:ss")}</span>
                      </div>
                      <p className="text-sm text-foreground mt-1 font-mono text-xs opacity-70 truncate max-w-[200px] md:max-w-xs">
                        {block.hash}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Proposer</span>
                      <span className="text-sm font-medium">{block.proposer.alias || block.proposer.address.slice(0, 6) + "..."}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Latest Transactions */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
              Latest Transactions
            </h2>
          </div>
          <div className="divide-y divide-border">
            {loadingTxs ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 animate-pulse flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-24 bg-muted rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              txs?.slice(0, 5).map((tx, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={tx.hash + i} 
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-muted text-muted-foreground border border-border">
                      {tx.type}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {(tx.amount / 1000000).toLocaleString()} ꜩ
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex-1 truncate font-mono text-xs text-muted-foreground">
                      <span className="text-foreground">{tx.sender.alias || tx.sender.address.slice(0, 6)}...</span>
                    </div>
                    <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                    <div className="flex-1 truncate font-mono text-xs text-muted-foreground text-right">
                      <span className="text-foreground">{tx.target.alias || tx.target.address.slice(0, 6)}...</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {txs?.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No recent transactions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
