# Rick & Morty – Fullstack (Express + GraphQL + React)

## 📦 Stack
- **Backend**: Node 22, Express 5, Apollo Server 5 (GraphQL), Sequelize, Redis, Swagger
- **DB**: Postgres 16 (con **pgAdmin**)
- **Frontend**: React 18, Vite, Apollo Client, React Router, Tailwind
- **Package manager**: pnpm

---

## ✅ Requisitos
- **Docker** (y Docker Compose)
- **Node 22**
- **pnpm** (si no lo tienes):  
  `corepack enable && corepack prepare pnpm@latest --activate`

---

## Arranque RÁPIDO (dev local con infra en Docker)

Este flujo levanta **Postgres/Redis/pgAdmin** en Docker y corre **Back y Front en local** (hot reload).

### 1) Levantar la infraestructura
En la **raíz** del proyecto:
```bash
docker compose up -d
```
Servicios:
- Postgres: `localhost:5432`
- Redis: `localhost:6379`
- pgAdmin: `http://localhost:5050`  
  user: `admin@example.com` / pass: `admin123`

> Si cambiaste puertos o credenciales, revisa `docker-compose.yml`.

### 2) Instalar dependencias del **Back**
```bash
cd Back
pnpm i
```

### 3) Migraciones y seed (DB)
```bash
cd Back
pnpm db:migrate
pnpm db:seed
```
> Alternativa de seed (desde la API):  
> `POST http://localhost:4000/api/characters/sync` con header `x-sync-secret: <tu_secreto>`.

### 4) Levantar **Backend**
```bash
pnpm dev
```
- GraphQL: `http://localhost:4000/graphql`  
- Swagger: `http://localhost:4000/docs`

### 5) Levantar **Frontend**
En otra terminal:
```bash
# desde raíz:
cd rickmorty-web   # (o cd front si tu carpeta se llama así)
pnpm i
# crea/ajusta variables:
echo "VITE_API_URL=http://localhost:4000/graphql
VITE_REST_URL=http://localhost:4000/api
VITE_ENABLE_ADMIN=1" > .env.development
pnpm dev
```
- Front dev: `http://localhost:5173`

> `VITE_ENABLE_ADMIN=1` muestra los botones de **Soft Delete/Restore** en el detalle.

---

## 🧩 Variables de entorno (resumen)

### Backend (ej. `.env` en `Back/`)
```ini
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=rm_user
DB_PASSWORD=rm_pass
DB_NAME=rickmorty

REDIS_HOST=localhost
REDIS_PORT=6379

CORS_ORIGINS=http://localhost:5173
SYNC_SECRET=supersecret123
```

> En Docker Compose ya hay valores para `postgres`, `redis`, `pgadmin`, `api` y `web`.  
> Para dev local, usa `localhost` como arriba.

### Frontend (`rickmorty-web/.env.development`)
```ini
VITE_API_URL=http://localhost:4000/graphql
VITE_REST_URL=http://localhost:4000/api
VITE_ENABLE_ADMIN=1
```

---

## 🌐 URLs útiles
- **Front (dev)**: `http://localhost:5173`
- **API GraphQL**: `http://localhost:4000/graphql`
- **Swagger**: `http://localhost:4000/docs`
- **pgAdmin**: `http://localhost:5050`  
  (Registrar servidor: host `postgres`, puerto `5432`, user `rm_user`, pass `rm_pass`)

---

## 🧪 Requests útiles (Postman / curl)

- **GraphQL – Lista personajes**
```json
{ "query": "query { characters { id name species image isFavorite } }" }
```

- **GraphQL – Solo favoritos**
```json
{ "query": "query { characters(filter:{ favorite:true }) { id name isFavorite } }" }
```

- **REST – Búsqueda con favoritos**
```
GET http://localhost:4000/api/characters?favorite=true
```

- **Seed desde endpoint protegido**
```bash
curl -X POST http://localhost:4000/api/characters/sync \
  -H "x-sync-secret: supersecret123"
```

---

## 🛠️ Scripts (Back)
En `Back/package.json`:
- `pnpm dev` – arranca el server en dev
- `pnpm build` – compila TypeScript a `dist/`
- `pnpm start` – ejecuta `node dist/server.js`
- `pnpm db:migrate` – corre migraciones
- `pnpm db:seed` – realiza seed inicial (15 personajes)

---

## 👤 Autor
**Juan Andres Troconis Redondo**  
📞 +57 310 524 9121  
✉️ jatroconis4@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/juan-andres-troconis-redondo-16a3a5218/)
