import { watchedAddresses, type InsertWatchedAddress, type WatchedAddress } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getWatchedAddresses(): Promise<WatchedAddress[]>;
  createWatchedAddress(address: InsertWatchedAddress): Promise<WatchedAddress>;
  deleteWatchedAddress(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getWatchedAddresses(): Promise<WatchedAddress[]> {
    return await db.select().from(watchedAddresses);
  }

  async createWatchedAddress(insertAddress: InsertWatchedAddress): Promise<WatchedAddress> {
    const [address] = await db
      .insert(watchedAddresses)
      .values(insertAddress)
      .returning();
    return address;
  }

  async deleteWatchedAddress(id: number): Promise<void> {
    await db.delete(watchedAddresses).where(eq(watchedAddresses.id, id));
  }
}

export const storage = new DatabaseStorage();
