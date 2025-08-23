import { Pool } from 'pg';

import * as z from 'zod';

const poolConfigSchema = z.object({
  host: z.string(),
  port: z.string().transform(Number),
  database: z.string(),
  user: z.string(),
  password: z.string(),
  ssl: z.boolean(),
});

export const poolConfig = poolConfigSchema.parse({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' || false,
});

export const pool = new Pool(poolConfig);
