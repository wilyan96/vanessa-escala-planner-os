# Eventora Planner

Plataforma web para wedding planners, organizadoras de eventos y agencias de planificacion.

## Que incluye esta base inicial

- Proyecto Next.js con TypeScript.
- Dashboard responsive de MVP.
- Estilos globales sin dependencia de Tailwind.
- Modelo Prisma para PostgreSQL.
- Documentacion de arquitectura, modulos, UX, integraciones y fases.

## Comandos

```bash
npm install
npm run dev
```

Luego abrir:

```text
http://localhost:3000
```

## Variables de entorno sugeridas

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/eventora"
AUTH_SECRET="change-me"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
EMAIL_PROVIDER_API_KEY=""
STORAGE_ACCESS_KEY=""
STORAGE_SECRET_KEY=""
STORAGE_BUCKET=""
```

## Estructura

```text
app/
  globals.css
  layout.tsx
  page.tsx
docs/
  architecture.md
  development-plan.md
  ui-ux.md
prisma/
  schema.prisma
```

## Siguiente paso tecnico

1. Instalar dependencias.
2. Crear base PostgreSQL.
3. Configurar `.env`.
4. Ejecutar `npx prisma migrate dev`.
5. Reemplazar datos mock del dashboard por consultas reales.
6. Crear rutas CRUD para clientes, eventos, proveedores, cotizaciones y pagos.
