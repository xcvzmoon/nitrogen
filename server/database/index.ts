import pg from 'pg';

import { poolConfig } from '../config/database';
import { drizzle } from 'drizzle-orm/node-postgres';
import { EnhancedQueryLogger } from 'drizzle-query-logger';

const { Pool } = pg;

export const db = drizzle({
  client: new Pool(poolConfig),
  logger: new EnhancedQueryLogger(),
});
