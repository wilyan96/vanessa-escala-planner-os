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

La version publicada en GitHub Pages incluye una puerta de acceso para demo personal.
La contrasena inicial se comparte por separado con la administradora del sistema.

Importante: GitHub Pages publica una app estatica. Este acceso evita entrada casual,
pero no reemplaza una autenticacion real de servidor. Para datos privados de clientes,
pagos y contratos, el siguiente paso recomendado es desplegar en Vercel con base de
datos PostgreSQL y autenticacion server-side.

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
7. Mover el login de demo a autenticacion real con usuarios y roles.
