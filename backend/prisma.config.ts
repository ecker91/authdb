// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || "mysql://root:senai@52.91.121.144:3306/authdb",
  },
});
