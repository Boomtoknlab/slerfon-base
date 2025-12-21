import { z } from 'zod';
import { 
  insertUserSchema, 
  insertStakeSchema, 
  insertProposalSchema, 
  insertSubmissionSchema,
  users,
  stakingPools,
  stakes,
  proposals,
  submissions,
  airdrops
} from './schema';

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
  users: {
    get: {
      method: 'GET' as const,
      path: '/api/users/:address',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  staking: {
    pools: {
      method: 'GET' as const,
      path: '/api/staking/pools',
      responses: {
        200: z.array(z.custom<typeof stakingPools.$inferSelect>()),
      },
    },
    stake: {
      method: 'POST' as const,
      path: '/api/staking/stake',
      input: insertStakeSchema,
      responses: {
        201: z.custom<typeof stakes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    userStakes: {
      method: 'GET' as const,
      path: '/api/staking/user/:userId',
      responses: {
        200: z.array(z.custom<typeof stakes.$inferSelect>()),
      },
    },
  },
  governance: {
    list: {
      method: 'GET' as const,
      path: '/api/governance/proposals',
      responses: {
        200: z.array(z.custom<typeof proposals.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/governance/proposals',
      input: insertProposalSchema,
      responses: {
        201: z.custom<typeof proposals.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    vote: {
      method: 'POST' as const,
      path: '/api/governance/proposals/:id/vote',
      input: z.object({ support: z.boolean() }),
      responses: {
        200: z.custom<typeof proposals.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  memeContest: {
    list: {
      method: 'GET' as const,
      path: '/api/meme-contest/submissions',
      responses: {
        200: z.array(z.custom<typeof submissions.$inferSelect>()),
      },
    },
    submit: {
      method: 'POST' as const,
      path: '/api/meme-contest/submit',
      input: insertSubmissionSchema,
      responses: {
        201: z.custom<typeof submissions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  airdrop: {
    list: {
      method: 'GET' as const,
      path: '/api/airdrop/campaigns',
      responses: {
        200: z.array(z.custom<typeof airdrops.$inferSelect>()),
      },
    },
  },
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
