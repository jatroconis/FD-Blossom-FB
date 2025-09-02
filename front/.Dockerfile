FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

ARG VITE_API_URL
ARG VITE_REST_URL
ARG VITE_ENABLE_ADMIN
RUN printf "VITE_API_URL=%s\nVITE_REST_URL=%s\nVITE_ENABLE_ADMIN=%s\n" \
    "$VITE_API_URL" "$VITE_REST_URL" "$VITE_ENABLE_ADMIN" > .env.production

COPY . .
RUN pnpm build

FROM nginx:alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

# no alcance por tiempo  :V pero esto no se usa