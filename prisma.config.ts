import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Load env for CLI usage
dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  ...(dbUrl ? { datasource: { url: dbUrl } } : {})
});
