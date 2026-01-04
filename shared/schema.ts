import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const watchedAddresses = pgTable("watched_addresses", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  label: text("label").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWatchedAddressSchema = createInsertSchema(watchedAddresses).omit({
  id: true,
  createdAt: true,
});

export type WatchedAddress = typeof watchedAddresses.$inferSelect;
export type InsertWatchedAddress = z.infer<typeof insertWatchedAddressSchema>;

// === API CONTRACT TYPES ===

// External API types (Tezos data)
export interface TezosBlock {
  level: number;
  hash: string;
  timestamp: string;
  proposer: { address: string; alias?: string };
  transactionCount: number;
}

export interface TezosAccount {
  address: string;
  balance: number; // in mutez
  type: string;
  firstActivityTime: string;
  lastActivityTime: string;
}

export interface TezosTransaction {
  type: string;
  id: number;
  level: number;
  timestamp: string;
  block: string;
  hash: string;
  sender: { address: string; alias?: string };
  target: { address: string; alias?: string };
  amount: number;
  status: string;
}
