# CLAUDE.md

Este archivo proporciona guía a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Comandos

```powershell
npm install
npm start                  # servidor de desarrollo → http://localhost:4200 (configuración development)
npm test                   # tests unitarios (Karma/Jasmine)
npm run build:dev          # build con entorno dev (optimización desactivada, source maps activados)
npm run build:qa
npm run build:etr
npm run build:prod         # optimización activada, source maps desactivados
npm run build:test         # build con environment.test.ts
```

Para ejecutar un único archivo de spec: `ng test --include=**/path/to/file.spec.ts`

## Arquitectura

App Angular 21 standalone — sin NgModules para las features. Punto de entrada: `src/main.ts` → `app.config.ts` → `app.routes.ts`.

Todas las rutas se cargan de forma perezosa (lazy) vía `loadComponent`. Todas las rutas excepto `/login` están protegidas por `authGuard`, que verifica la existencia de un token mediante `LocalStorageService` y compara `loginService.rolesUser()` contra `urlsWithPermissions` en `core/constants/header-links.ts`, redirigiendo las rutas no autorizadas a `/404`. La decodificación del JWT ocurre una sola vez en `LoginService.setUser()` (que rellena la señal `rolesUser`, no se vuelve a decodificar en cada navegación); el manejo de tokens expirados/inválidos se hace de forma centralizada en `HttpErrorHandlerService`, que llama a `LoginService.logout()` ante respuestas 401/402/403 — el guard en sí nunca dispara el logout.

### `src/app/core/`

| Sub-ruta | Propósito |
|---|---|
| `environments/` | URL base de la API por entorno (`environment.development.ts` es la que se usa por defecto en tiempo de importación; `angular.json` la reemplaza en tiempo de build para dev/qa/etr/prod/test) |
| `interceptors/header.interceptor.ts` | Añade `Authorization: Bearer <token>` a cada request; ante 401/403 llama a `LoginService.logout()` |
| `interceptors/loader.interceptor.ts` | Muestra/oculta un spinner global vía `LoaderService` alrededor de cada request HTTP |
| `services/curd.service.ts` | `CrudService<T>` genérico — clase base que provee `findAll/findById/create/update/delete`. Los servicios de cada feature la extienden o inyectan `HttpClient` directamente. Envuelve los errores mediante `HttpErrorHandlerService` |
| `services/login.service.ts` | Mantiene señales de Angular para el estado autenticado: `user`, `userEmail`, `userId`, `rolesUser`, `enterpriseUserLogued`. Usar `loginService.haveSomeRole(roles)` para condicionar elementos de UI |
| `services/message.service.ts` (`MessageWsService`) | Cliente WebSocket STOMP/SockJS. Gestiona las suscripciones a `/topic/user/{email}/tickets`, `/topic/user/{email}`, `/topic/user/{email}/ticketFlow`, `/topic/user/{email}/notifications/unread` (alimenta la señal `notificationsWithoutRead` y reproduce `assets/sounds/whatsapp-apple.mp3`), y los topics por ticket |
| `services/notification.service.ts` | Cliente REST para notificaciones (`getAll`, `getAllUnread`, `markAsRead`, `markAllAsRead` contra `{server_url}notifications`); acompañado de `core/interfaces/notification.interface.ts` y `core/enums/notification-type.enum.ts` |
| `services/helpers.service.ts` | Envuelve el `MessageService` de PrimeNG para mostrar notificaciones toast |
| `services/http-error-handler.service.ts` | Formatea los errores HTTP según código de estado (401/402/403 → `LoginService.logout()`; 500 → mensaje genérico) y los muestra como toasts |
| `constants/` | Literales de texto compartidos: `LABELS`, `MESSAGES`, `TOOLTIPS`, `LOCAL_STORAGE`, `header-links` (exporta `urlsWithPermissions`, el mapa de roles-permisos, y `configurationLinks`, el listado del submenú de configuración), `buttons-ticket` |
| `enums/roles.ts` | `ROLES_CODE_SYSTEM`: `ADM`, `MNT`, `SPV`, `USR`, `LDR`, `TECH`, `APMO` |
| `layout/header/` | Componente de cabecera — renderiza los enlaces de navegación filtrados por rol, cambia entre tema claro/oscuro intercambiando el href de la hoja de estilos `styles-light.css` / `styles-dark.css`, y aloja `notification-panel/` (`NotificationPanelComponent`), que lee `MessageWsService`/`NotificationService` para mostrar las notificaciones de tickets sin leer |

### `src/app/modules/`

Cada carpeta es una feature cargada de forma perezosa. El flujo de tickets es el núcleo:

- **`tickets/`** — vista principal del listado de tickets; recibe el parámetro de ruta `typeOfListTicket` para alternar entre las vistas de solicitante (`myTicket`), técnico (`pending`) y aprobador. Gestiona todas las transiciones de la máquina de estados del ticket (`ticketFunction` → endpoint `flowConfigurations/function`)
- **`tickets-historical/`** — vista histórica paginada con filtros; `TicketService` vive aquí (se importa vía `@ticket-historical/services/tickets.service`)
- **`home/`** — formulario de creación de nuevo ticket
- **`ticket-incident/`** — creación de incidentes
- **`management-teams/`** — vista de asignación de tickets para técnicos/líderes/supervisores
- **`login/`** — pantalla de inicio de sesión
- Pantallas CRUD solo para administradores: `enterprises/`, `enterprise-categories/`, `team/`, `team-members/`, `categories/`, `user/` (los usuarios se gestionan en este módulo), `role/`, `permission/`, `parameters/`, `branch/`, `country/`, `cost-center/`, `holiday/`, `schedule/`, `schedule-detail/`, `sla/`, `supervisor/`, `supervisor-categories/`, `observer-group/`, `territorial-division/`, `incident-title/`, `reports/`

### `src/app/shared/`

- **`prime-components/prime-components.module.ts`** — `NgModule` de barril que re-exporta todos los módulos de PrimeNG usados en la app. Importar `PrimeModules` en los componentes standalone en lugar de módulos individuales de PrimeNG
- **`shared/components/`** — modales y tablas reutilizables usados entre módulos de features (ej. `modal-info-ticket`, `modal-form-ticket`, `generic-table`, `modal-messages-ticket`)

## Convenciones clave

**Cambio de tema:** El modo oscuro se aplica añadiendo la clase `.ticket-mode-dark` al `<html>`. PrimeNG usa `darkModeSelector: '.ticket-mode-dark'` (ver `app.config.ts`). Los dos bundles SCSS (`styles-light.scss` / `styles-dark.scss`) se compilan como chunks separados con `inject: false`; el componente de cabecera los intercambia en tiempo de ejecución actualizando el `href` de `#theme-main`.

**Estado en servicios:** `LoginService` usa señales de Angular (`signal<>`) para el estado reactivo de autenticación. Los servicios de cada feature usan `EventEmitter` (`@Output()`) para abrir modales entre componentes en lugar de pasar referencias.

**Alias de rutas de TypeScript** (configurados en `tsconfig.json`):

| Alias | Resuelve a |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |
| `@category/*` | `src/app/modules/categories/*` |
| `@team/*` | `src/app/modules/team/*` |
| `@team-members/*` | `src/app/modules/team-members/*` |
| `@enterprise/*` | `src/app/modules/enterprises/*` |
| `@enterpriseCategory/*` | `src/app/modules/enterprise-categories/*` |
| `@enterpriseCategoryDetail/*` | `src/app/modules/enterprise-category-detail/*` |
| `@ticket-historical/*` | `src/app/modules/tickets-historical/*` |
| `@ticketCard/*` | `src/app/modules/tickets-card/*` |
| `@supervisor/*` | `src/app/modules/supervisor/*` |
| `@supervisorCategory/*` | `src/app/modules/supervisor-categories/*` |
| `@parameter/*` | `src/app/modules/parameters/*` |

**`strictNullChecks` está desactivado** (`tsconfig.json`). No activarlo sin abordar todo el código base.

## Archivos de entorno

`environment.development.ts` es el que importa directamente cada servicio. `angular.json` lo reemplaza en tiempo de build:

| Configuración de build | Archivo de entorno usado |
|---|---|
| `development` / `npm start` | `environment.development.ts` → backend de dev |
| `dev` | `environment.dev.ts` |
| `qa` | `environment.qa.ts` |
| `etr` | `environment.etr.ts` |
| `production` | `environment.ts` |
| `test` | `environment.test.ts` |
