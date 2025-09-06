import { defineConfig } from 'drizzle-kit';
import { poolConfig } from '~/config/database';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    host: poolConfig.host,
    port: poolConfig.port,
    database: poolConfig.database,
    user: poolConfig.user,
    password: poolConfig.password,
    ssl: poolConfig.ssl,
  },
  schema: './server/database/schemas/*.ts',
  out: './server/database/migrations',
  casing: 'snake_case',
  verbose: true,
  strict: true,
});
