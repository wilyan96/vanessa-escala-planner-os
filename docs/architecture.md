# Eventora Planner - Arquitectura funcional y tecnica

## Vision del producto

Eventora Planner centraliza la operacion completa de una organizadora de eventos: captura de prospectos, CRM, cotizaciones, contratos, pagos, calendario, proveedores, cronogramas, documentos, invitados, mesas y ejecucion del evento.

El sistema debe iniciar como una aplicacion interna para una organizadora y evolucionar hacia SaaS multiempresa sin reescribir el nucleo.

## Modulos principales

1. Dashboard operativo: proximos eventos, eventos activos, tareas, pagos, reuniones, cotizaciones, contratos, clientes nuevos y alertas.
2. CRM de clientes: datos de contacto, estado comercial, historial, documentos, notas internas y seguimientos.
3. Eventos: ficha digital completa por evento con presupuesto, lugares, equipo, proveedores, checklist, cronograma y archivos.
4. Cronograma: linea de tiempo del dia del evento con hora, actividad, responsable, lugar, proveedor, notas y estado.
5. Checklist inteligente: plantillas por tipo de evento, tareas sugeridas, responsables, vencimientos, alertas y filtros.
6. Proveedores: directorio, categorias, tarifas, contactos, documentos, notas, estado y asignacion a eventos.
7. Cotizaciones: generacion por plantillas, items, descuentos, impuestos, vencimiento, PDF, envio por correo y duplicado.
8. Contratos: plantillas legales, campos dinamicos, PDF, estados de firma y futura firma electronica.
9. Finanzas: precio contratado, abonos, saldo, pagos a proveedores, gastos, ganancia estimada y reportes.
10. Calendario: Google Calendar para eventos, reuniones, ensayos, visitas y deadlines.
11. Correos: plantillas personalizadas, envio SMTP/Gmail API e historial por cliente.
12. Notificaciones: vencimientos, pagos, reuniones, proveedores, documentos y cotizaciones sin respuesta.
13. Documentos: almacenamiento seguro por cliente, evento y proveedor.
14. Invitados: RSVP, acompanantes, mesa, menu especial, observaciones y exportacion.
15. Mesas: asignacion visual de invitados a mesas y exportacion.
16. Equipo: colaboradores, roles, horarios, tareas, pago acordado y estado de pago.
17. Reportes: eventos, ingresos, conversion, clientes, pagos, proveedores, tipos de evento y rentabilidad.
18. Portales: cliente y proveedor con permisos limitados.
19. Seguridad: login, roles, auditoria, backups, proteccion de datos y almacenamiento privado.

## Arquitectura recomendada

- Frontend: Next.js con React, TypeScript y componentes responsivos.
- Backend inicial: API Routes/Server Actions de Next.js para MVP.
- Backend escalable: separar a NestJS, Laravel o Django cuando haya integraciones pesadas, jobs y multiempresa avanzado.
- Base de datos: PostgreSQL.
- ORM: Prisma.
- Autenticacion: NextAuth/Auth.js con email/password o proveedor externo como Clerk/Auth0 si se desea acelerar.
- Archivos: S3, Cloudflare R2, Google Cloud Storage o Supabase Storage.
- PDFs: generacion server-side con plantillas HTML y motor como Playwright/Puppeteer.
- Correos: Resend, SendGrid, Postmark, SMTP o Gmail API.
- Calendario: Google Calendar API con OAuth por organizacion.
- Jobs: cola con BullMQ/Redis o servicio serverless programado para recordatorios.
- Deploy: Vercel para frontend/API inicial, Neon/Supabase/RDS para PostgreSQL y S3/R2 para documentos.

## Flujo de uso principal

1. La organizadora registra un prospecto desde CRM o formulario web.
2. El prospecto queda con estado `prospecto` y seguimiento pendiente.
3. Se crea cotizacion desde plantilla con servicios, cantidades, descuentos e impuestos.
4. La cotizacion se exporta en PDF, se envia por correo y queda guardada en el cliente.
5. Al aceptar, se crea evento, contrato, plan de pagos y checklist sugerido segun tipo de evento.
6. El equipo asigna proveedores, documentos, cronograma e invitados.
7. El dashboard muestra alertas de tareas, pagos, contratos y proveedores.
8. El cliente consulta portal con informacion compartida, pagos, documentos y cronograma.
9. Los proveedores consultan instrucciones y confirman disponibilidad.
10. Despues del evento se cierra financieramente, se solicita testimonio y se archiva.

## Roles y permisos

- Administradora principal: acceso completo, configuracion, finanzas, usuarios y reportes.
- Coordinadora: eventos, clientes, cronogramas, checklist, proveedores y documentos operativos.
- Asistente: tareas, invitados, documentos y seguimiento limitado.
- Finanzas: cotizaciones, pagos, gastos, reportes financieros y comprobantes.
- Cliente: portal con datos compartidos, pagos, contrato, cotizaciones, cronograma y documentos visibles.
- Proveedor: portal de eventos asignados, horarios, instrucciones y carga de propuestas.

## Pantallas necesarias

- Login y recuperacion de contrasena.
- Dashboard.
- Clientes: lista, filtros, ficha, historial, documentos y seguimientos.
- Eventos: lista, ficha, cronograma, checklist, equipo, proveedores, invitados, mesas, documentos y finanzas.
- Proveedores: lista, ficha, eventos asociados y documentos.
- Cotizaciones: lista, editor, vista previa PDF, envio y duplicado.
- Contratos: lista, editor de plantillas, contrato generado y estado de firma.
- Pagos: calendario de cobros, comprobantes, gastos y rentabilidad.
- Calendario: vista mensual/semanal/lista e integracion Google.
- Correos: plantillas, editor, envio e historial.
- Reportes.
- Configuracion: marca, usuarios, roles, plantillas, impuestos, categorias y checklist base.
- Portal del cliente.
- Portal de proveedores.

## MVP inicial recomendado

El MVP debe incluir:

- Dashboard operativo.
- CRM de clientes.
- Ficha de evento.
- Checklist por tipo de evento.
- Cronograma en linea de tiempo.
- Proveedores y asignacion a eventos.
- Cotizaciones basicas con PDF.
- Contratos basicos desde plantilla.
- Pagos, abonos y saldo.
- Documentos por cliente/evento.
- Correos con plantillas.

Se pospone para fase posterior:

- Portal de proveedores avanzado.
- Distribucion visual drag and drop de mesas.
- Firma electronica.
- Auditoria avanzada.
- Reportes predictivos.
- Automatizaciones complejas.

## Integraciones

- Google Calendar API: OAuth, sincronizacion bidireccional opcional, deduplicacion con `googleCalendarEventId`.
- Email: proveedor transaccional recomendado para confiabilidad; Gmail API si la marca necesita enviar desde su cuenta.
- Storage: URLs firmadas para proteger documentos privados.
- PDF: cotizaciones, contratos, cronogramas, listas de invitados y reportes.
- Excel: exportacion de invitados, finanzas y reportes.
- Firma electronica futura: DocuSign, Dropbox Sign, SignWell o proveedor local.

## Escalabilidad

- Usar `organizationId` desde el inicio para multiempresa.
- Aplicar permisos por rol en cada endpoint y consulta.
- Mantener archivos fuera de la base de datos.
- Separar jobs de recordatorios y correos para no bloquear la UI.
- Versionar plantillas de contratos y cotizaciones.
- Registrar auditoria en cambios sensibles: pagos, contratos, documentos y permisos.
- Usar indices por `organizationId`, fechas, estados y relaciones frecuentes.
- Preparar API interna para integraciones futuras con formularios, landing pages y automatizaciones.
