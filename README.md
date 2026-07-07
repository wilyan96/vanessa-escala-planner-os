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
npm run verify
```

Luego abrir:

```text
http://localhost:3000
```

## Acceso personal

La version publicada en Vercel incluye una puerta de acceso para demo personal.
La contrasena inicial se comparte por separado con la administradora del sistema.

Importante: este acceso evita entrada casual, pero la siguiente fase de seguridad es
mover la autenticacion a servidor con usuarios y roles.

## Vercel + Prisma

Vercel es el hosting principal del sistema. El build ejecuta:

```bash
prisma generate
node scripts/vercel-db-push.mjs
next build
```

`scripts/vercel-db-push.mjs` solo aplica `prisma db push` dentro de Vercel cuando
existe `DATABASE_URL`; en local no toca ninguna base de datos.

Variables necesarias en Vercel:

```text
DATABASE_URL
AUTH_SECRET
```

El primer modulo conectado a Prisma es Clientes. Los demas modulos siguen en modo
demo mientras se migran por fases.

## Correos y PDF

El modulo de cotizaciones ya no muestra envio por WhatsApp. El flujo de correo
genera el PDF de la cotizacion, lo descarga en el equipo y abre el cliente de correo
con asunto y cuerpo listos para adjuntar ese archivo.

El envio automatico de correos con PDF adjunto requiere backend o proveedor de email
transaccional, porque los navegadores no permiten adjuntar archivos automaticamente
desde enlaces `mailto`.

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
7. Migrar Eventos a Prisma.
8. Migrar Finanzas, pagos y alertas automaticas.
9. Mover el login de demo a autenticacion real con usuarios y roles.
