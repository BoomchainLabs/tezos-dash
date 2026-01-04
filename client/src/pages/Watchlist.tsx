import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from "@/hooks/use-watchlist";
import { useTezosAccount } from "@/hooks/use-tezos";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWatchedAddressSchema, type InsertWatchedAddress } from "@shared/schema";
import { Eye, Plus, Trash2, Wallet, ExternalLink, Activity } from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sub-component for individual watchlist items to manage their own data fetching
function WatchlistItem({ item, onRemove }: { item: any; onRemove: (id: number) => void }) {
  const { data: account, isLoading } = useTezosAccount(item.address);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "group bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300",
        expanded ? "ring-2 ring-primary ring-offset-2" : "hover:border-primary/50"
      )}
    >
      <div 
        className="p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none mb-1">{item.label}</h3>
              <p className="font-mono text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-xs">
                {item.address}
              </p>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="text-muted-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Balance</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-display font-bold text-foreground">
                {account ? (account.balance / 1000000).toLocaleString() : "0"} 
                <span className="text-sm text-muted-foreground ml-1 font-normal">ꜩ</span>
              </div>
            )}
          </div>
          <Activity className={cn("text-muted-foreground transition-transform duration-300", expanded && "rotate-180")} size={20} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && account && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-muted/30 px-5 py-4 text-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Account Type</p>
                <p className="font-medium capitalize">{account.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">First Activity</p>
                <p className="font-medium">{format(new Date(account.firstActivityTime), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Activity</p>
                <p className="font-medium">{format(new Date(account.lastActivityTime), "MMM d, HH:mm")}</p>
              </div>
              <div className="flex items-end">
                <a 
                  href={`https://tzkt.io/${item.address}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-primary hover:underline text-xs flex items-center gap-1"
                >
                  View on TzKT <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Watchlist() {
  const { data: watchlist, isLoading } = useWatchlist();
  const { mutate: addAddress, isPending: isAdding } = useAddToWatchlist();
  const { mutate: removeAddress } = useRemoveFromWatchlist();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<InsertWatchedAddress>({
    resolver: zodResolver(insertWatchedAddressSchema),
    defaultValues: {
      address: "",
      label: "",
    }
  });

  const onSubmit = (data: InsertWatchedAddress) => {
    addAddress(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Watchlist</h1>
          <p className="text-muted-foreground">Track balances and activity of specific Tezos accounts</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl h-12 px-6">
              <Plus className="mr-2 h-4 w-4" /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add to Watchlist</DialogTitle>
              <DialogDescription>
                Enter a Tezos address (starting with tz1, tz2, tz3, KT1) to track its activity.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="address">Tezos Address</Label>
                <Input 
                  id="address" 
                  placeholder="tz1..." 
                  {...form.register("address")}
                  className="font-mono text-sm"
                />
                {form.formState.errors.address && (
                  <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label (e.g. My Wallet, Binance)</Label>
                <Input 
                  id="label" 
                  placeholder="Main Wallet" 
                  {...form.register("label")} 
                />
                {form.formState.errors.label && (
                  <p className="text-xs text-destructive">{form.formState.errors.label.message}</p>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isAdding} className="w-full sm:w-auto">
                  {isAdding ? "Adding..." : "Add to Watchlist"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-card rounded-xl border border-border animate-pulse p-6">
              <div className="h-6 w-1/3 bg-muted rounded mb-4" />
              <div className="h-4 w-2/3 bg-muted rounded mb-8" />
              <div className="h-10 w-1/2 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : watchlist?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Your watchlist is empty</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Add addresses to keep track of their balances and latest activity on the Tezos network.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
            className="border-primary/20 hover:bg-primary/5 text-primary"
          >
            Add your first address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {watchlist?.map((item) => (
              <WatchlistItem 
                key={item.id} 
                item={item} 
                onRemove={(id) => removeAddress(id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </Layout>
  );
}
