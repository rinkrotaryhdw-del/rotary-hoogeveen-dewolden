import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const nieuws = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/nieuws' }),
  schema: z.object({
    titel: z.string(),
    datum: z.coerce.date(),
    samenvatting: z.string().optional(),
    afbeelding: z.string().optional(),
    afbeelding_alt: z.string().optional(),
    concept: z.boolean().optional().default(false),
  }),
});

const edities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/edities' }),
  schema: z.object({
    jaar: z.coerce.number(),
    titel: z.string(),
    datum: z.string().optional(),
    locatie: z.string().optional(),
    samenvatting: z.string().optional(),
    goed_doel: z.string().optional(),
    opbrengst: z.string().optional(),
    kaartverkoop_url: z.string().url().optional().or(z.literal('')),
    kaartverkoop_status: z
      .enum(['binnenkort', 'open', 'uitverkocht', 'afgelopen'])
      .default('binnenkort'),
    afbeelding: z.string().optional(),
    afbeelding_alt: z.string().optional(),
    afbeelding_positie: z.enum(['left', 'center', 'right']).optional().default('center'),
    galerij: z
      .array(z.object({ afbeelding: z.string(), alt: z.string().optional() }))
      .optional()
      .default([]),
  }),
});

export const collections = { nieuws, edities };
