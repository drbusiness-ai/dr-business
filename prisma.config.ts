import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Load env for CLI usage
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
