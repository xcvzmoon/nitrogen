import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../config/database';

export const db = drizzle({ client: pool });
