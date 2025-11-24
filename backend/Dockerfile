# Stage 1 — Build
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia Prisma e gera client
COPY prisma ./prisma
RUN npx prisma generate

# Copia código e compila TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2 — Produção
FROM node:20-alpine AS prod
WORKDIR /usr/src/app

# Copia node_modules, dist e Prisma
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

# Porta da aplicação
EXPOSE 3000

# Comando para aplicar migrations e iniciar app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
