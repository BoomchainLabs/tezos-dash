import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const TZKT_API_BASE = 'https://api.tzkt.io/v1';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Watchlist Routes ===

  app.get(api.watchlist.list.path, async (req, res) => {
    const addresses = await storage.getWatchedAddresses();
    res.json(addresses);
  });

  app.post(api.watchlist.create.path, async (req, res) => {
    try {
      const input = api.watchlist.create.input.parse(req.body);
      const address = await storage.createWatchedAddress(input);
      res.status(201).json(address);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      // Handle unique constraint violation
      if (err instanceof Error && 'code' in err && err.code === '23505') {
        return res.status(400).json({ message: 'Address is already being watched' });
      }
      throw err;
    }
  });

  app.delete(api.watchlist.delete.path, async (req, res) => {
    await storage.deleteWatchedAddress(Number(req.params.id));
    res.status(204).send();
  });

  // === Tezos Proxy Routes ===

  app.get(api.tezos.getBlocks.path, async (req, res) => {
    try {
      const response = await fetch(`${TZKT_API_BASE}/blocks?sort.desc=level&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch blocks');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Tezos API Error:', error);
      res.status(500).json({ message: 'Failed to fetch Tezos data' });
    }
  });

  app.get(api.tezos.getTransactions.path, async (req, res) => {
    try {
      const response = await fetch(`${TZKT_API_BASE}/operations/transactions?sort.desc=id&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Tezos API Error:', error);
      res.status(500).json({ message: 'Failed to fetch Tezos data' });
    }
  });

  app.get(api.tezos.getAccount.path, async (req, res) => {
    try {
      const { address } = req.params;
      const response = await fetch(`${TZKT_API_BASE}/accounts/${address}`);
      if (response.status === 404) {
        return res.status(404).json({ message: 'Account not found' });
      }
      if (!response.ok) throw new Error('Failed to fetch account');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Tezos API Error:', error);
      res.status(500).json({ message: 'Failed to fetch Tezos data' });
    }
  });

  return httpServer;
}
