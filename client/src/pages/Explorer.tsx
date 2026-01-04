import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useTezosAccount } from "@/hooks/use-tezos";
import { Search, Wallet, Calendar, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Explorer() {
  const [searchInput, setSearchInput] = useState("");
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  
  const { data: account, isLoading, error } = useTezosAccount(activeAddress);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim().length > 0) {
      setActiveAddress(searchInput.trim());
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Block Explorer
          </h1>
          <p className="text-lg text-muted-foreground">
            Search for any Tezos address to view details and balance
          </p>
        </div>

        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full opacity-20 transform -translate-y-4" />
          <form onSubmit={handleSearch} className="relative z-10">
            <div className="flex gap-2 p-2 bg-card rounded-2xl shadow-xl shadow-black/5 border border-border">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search by address (tz1, KT1...)" 
                  className="pl-12 border-none shadow-none h-14 text-lg bg-transparent focus-visible:ring-0"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl font-bold">
                Search
              </Button>
            </div>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="h-64 bg-card rounded-3xl border border-border animate-pulse p-8" />
            </motion.div>
          ) : error || (activeAddress && !account) ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-destructive/5 border border-destructive/20 rounded-3xl text-center"
            >
              <h3 className="text-destructive font-bold text-lg mb-2">Address Not Found</h3>
              <p className="text-muted-foreground">
                We couldn't find any data for that address. Please check the format and try again.
              </p>
            </motion.div>
          ) : account ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl shadow-black/5"
            >
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border-b border-border/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary border border-border/50">
                      <Wallet size={32} />
                    </div>
                    <div>
                      <h2 className="text-sm font-mono text-muted-foreground mb-1 uppercase tracking-wider">Address</h2>
                      <p className="font-mono text-lg md:text-xl font-bold text-foreground break-all">{account.address}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-2 capitalize">
                        {account.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-left md:text-right bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Balance</p>
                    <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
                      {(account.balance / 1000000).toLocaleString()} 
                      <span className="text-lg text-muted-foreground ml-2 font-normal">XTZ</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="p-3 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">First Activity</p>
                    <p className="text-lg font-semibold">
                      {format(new Date(account.firstActivityTime), "MMMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(account.firstActivityTime), "HH:mm:ss")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Last Activity</p>
                    <p className="text-lg font-semibold">
                      {format(new Date(account.lastActivityTime), "MMMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(account.lastActivityTime), "HH:mm:ss")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8">
                <a 
                  href={`https://tzkt.io/${account.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-full py-4 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors group"
                >
                  View full history on TzKT
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20 opacity-50">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p>Enter an address above to explore</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
