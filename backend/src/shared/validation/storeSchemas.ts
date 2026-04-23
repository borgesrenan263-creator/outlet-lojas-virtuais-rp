import { z } from 'zod';

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
    description: z.string().max(500).optional(),
    logoUrl: z.string().url().optional(),
    bannerUrl: z.string().url().optional(),
    pixKey: z.string().optional(),
  }),
});

export const updateStoreSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
    logoUrl: z.string().url().optional().nullable(),
    bannerUrl: z.string().url().optional().nullable(),
    isOpen: z.boolean().optional(),
    pixKey: z.string().optional().nullable(),
  }),
});
