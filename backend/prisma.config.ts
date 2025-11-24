// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  // nome do datasource deve bater com schema.prisma
  datasource: {
      url: process.env.DATABASE_URL || "mysql://root:senai@localhost:3306/authdb",
  },
});
