import { z } from 'zod';
import { insertWatchedAddressSchema, watchedAddresses } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // Database endpoints (Watchlist)
  watchlist: {
    list: {
      method: 'GET' as const,
      path: '/api/watchlist',
      responses: {
        200: z.array(z.custom<typeof watchedAddresses.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/watchlist',
      input: insertWatchedAddressSchema,
      responses: {
        201: z.custom<typeof watchedAddresses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/watchlist/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  
  // Proxy endpoints (Real Tezos Data)
  tezos: {
    getBlocks: {
      method: 'GET' as const,
      path: '/api/tezos/blocks',
      responses: {
        200: z.array(z.custom<any>()), // Typed manually in frontend component as TezosBlock[]
      },
    },
    getAccount: {
      method: 'GET' as const,
      path: '/api/tezos/account/:address',
      responses: {
        200: z.custom<any>(), // Typed as TezosAccount
        404: errorSchemas.notFound,
      },
    },
    getTransactions: {
      method: 'GET' as const,
      path: '/api/tezos/transactions',
      responses: {
        200: z.array(z.custom<any>()), // Typed as TezosTransaction[]
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
