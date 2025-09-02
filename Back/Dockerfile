FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src

RUN pnpm build  # <-- debe generar ./dist

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

COPY --from=deps /app/node_modules ./node_modules
RUN pnpm prune --prod

COPY package.json ./
COPY --from=build /app/dist ./dist 

EXPOSE 4000
CMD ["node", "dist/server.js"]


# no alcance por tiempo  :V pero esto no se usa