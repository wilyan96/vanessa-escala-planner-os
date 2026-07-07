# Direccion UX/UI

## Principios

- Operacion primero: la pantalla inicial debe responder que requiere atencion hoy.
- Elegante pero sobrio: lujo, claridad y confianza sin exceso decorativo.
- Responsive real: escritorio para planeacion, movil para ejecucion en evento.
- Informacion escaneable: estados, fechas, montos y responsables visibles.
- Separacion entre informacion interna y compartida con cliente/proveedor.

## Estilo visual sugerido

- Fondo calido claro.
- Superficies blancas o marfil.
- Acento principal personalizable por marca.
- Acento secundario verde profundo para confirmaciones.
- Dorado sobrio para detalles premium.
- Bordes de 8px, sombras suaves y tipografia limpia.

## Navegacion

- Sidebar en escritorio.
- Navegacion compacta en tablet y movil.
- Acciones principales siempre visibles: crear cliente, crear evento, buscar.
- Fichas de evento con tabs: resumen, cronograma, checklist, proveedores, invitados, mesas, documentos, finanzas.

## Estados clave

- Verde: confirmado, al dia, pagado.
- Amarillo: requiere seguimiento, proximo a vencer.
- Rojo: vencido, sin confirmar, contrato pendiente.
- Gris: borrador, archivado o sin estado.

## MVP visual incluido

El archivo `app/page.tsx` implementa un dashboard inicial con:

- Navegacion por modulos.
- Indicadores principales.
- Proximos eventos.
- CRM y seguimientos.
- Cotizaciones y contratos.
- Finanzas.
- Alertas.
- Cronograma.
- Checklist.
- Proveedores.
