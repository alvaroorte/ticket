# Clicket

Aplicación web de gestión de tickets (mesa de ayuda / service desk). Permite a solicitantes crear tickets, a técnicos gestionarlos y resolverlos, y a supervisores/administradores configurar equipos, categorías, SLAs y permisos, con notificaciones en tiempo real vía WebSocket.

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Scripts disponibles](#scripts-disponibles)
- [Configuración de entornos](#configuración-de-entornos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura y convenciones clave](#arquitectura-y-convenciones-clave)
- [Testing](#testing)

## Stack tecnológico

- **Angular 21** (standalone components, sin NgModules para features)
- **PrimeNG 21** + PrimeFlex + PrimeIcons (componentes UI)
- **RxJS**
- **@stomp/stompjs + sockjs-client** — notificaciones y actualizaciones de tickets en tiempo real
- **ngx-translate** — internacionalización
- **jwt-decode** — decodificación de JWT de autenticación
- **Highcharts** — gráficos en reportes
- **ExcelJS / file-saver** — exportación de datos
- **Quill** — editor de texto enriquecido

## Requisitos previos

- Node.js compatible con Angular 21 (LTS activa recomendada). Consultar la [tabla de versiones compatibles de Angular](https://angular.dev/reference/versions) para verificar la versión de Node requerida
- npm

## Instalación

```powershell
npm install
```

## Scripts disponibles

```powershell
npm start                  # servidor de desarrollo → http://localhost:4200 (configuración development)
npm test                   # tests unitarios (Karma/Jasmine)
npm run build:dev          # build con entorno dev
npm run build:qa           # build con entorno qa
npm run build:etr          # build con entorno etr
npm run build:prod         # build de producción (optimización activada, sin source maps)
npm run build:test         # build con environment.test.ts
```

Para ejecutar un único archivo de spec:

```powershell
ng test --include=**/path/to/file.spec.ts
```

## Configuración de entornos

Cada configuración de build de `angular.json` reemplaza el archivo de entorno usado por los servicios en tiempo de build:

| Configuración de build | Archivo de entorno usado |
|---|---|
| `development` / `npm start` | `environment.development.ts` → backend de desarrollo |
| `dev` | `environment.dev.ts` |
| `qa` | `environment.qa.ts` |
| `etr` | `environment.etr.ts` |
| `production` | `environment.ts` |
| `test` | `environment.test.ts` |

Los archivos de entorno viven en `src/app/core/environments/` y definen la URL base de la API por entorno.

## Estructura del proyecto

```
src/app/
├── core/                 # servicios transversales, interceptors, constantes, enums, layout
│   ├── environments/      # configuración por entorno
│   ├── interceptors/      # header (auth) y loader (spinner global)
│   ├── services/          # login, CRUD genérico, WebSocket, notificaciones, manejo de errores HTTP
│   ├── constants/         # labels, mensajes, tooltips, mapa de roles-permisos
│   ├── enums/              # roles del sistema
│   └── layout/header/      # cabecera, navegación por rol, panel de notificaciones
├── modules/               # features, cada una lazy-loaded vía loadComponent
│   ├── login/
│   ├── home/               # creación de nuevo ticket
│   ├── tickets/             # listado principal (solicitante / técnico / aprobador)
│   ├── tickets-historical/  # histórico paginado con filtros
│   ├── ticket-incident/     # creación de incidentes
│   ├── management-teams/    # asignación de tickets
│   └── ...                  # pantallas CRUD de administración (empresas, equipos, categorías, usuarios, roles, permisos, SLA, etc.)
└── shared/
    ├── prime-components/    # módulo barril que re-exporta PrimeNG
    └── shared/components/   # modales y tablas reutilizables entre features
```

## Arquitectura y convenciones clave

- **Standalone, sin NgModules de feature.** El punto de entrada es `src/main.ts` → `app.config.ts` → `app.routes.ts`. Todas las rutas se cargan de forma perezosa (`loadComponent`).
- **Autenticación y autorización.** Todas las rutas excepto `/login` están protegidas por `authGuard`, que valida el token vía `LocalStorageService` y compara los roles del usuario (`LoginService.rolesUser()`) contra el mapa de permisos de `core/constants/header-links.ts`. El JWT se decodifica una única vez en `LoginService.setUser()`. Los tokens expirados o inválidos se gestionan de forma centralizada en `HttpErrorHandlerService`, que cierra la sesión ante respuestas 401/402/403.
- **Estado reactivo.** `LoginService` expone señales de Angular (`signal<>`) para el estado de sesión (`user`, `userEmail`, `userId`, `rolesUser`, `enterpriseUserLogued`). Usar `loginService.haveSomeRole(roles)` para condicionar la UI según el rol.
- **Comunicación entre componentes.** Los servicios de cada feature usan `EventEmitter` (`@Output()`) para abrir modales entre componentes, en lugar de pasar referencias directas.
- **Tema claro/oscuro.** El modo oscuro se aplica añadiendo la clase `.ticket-mode-dark` al `<html>`. Los estilos viven en dos bundles separados (`styles-light.scss` / `styles-dark.scss`), compilados como chunks independientes; el componente de cabecera intercambia en tiempo de ejecución el `href` de `#theme-main`.
- **Notificaciones y tiempo real.** `MessageWsService` (STOMP/SockJS) gestiona las suscripciones a los topics de tickets y notificaciones por usuario, y reproduce un sonido al recibir notificaciones nuevas. `NotificationService` expone el cliente REST equivalente.
- **Alias de rutas TypeScript** (`tsconfig.json`): `@core/*`, `@shared/*`, `@category/*`, `@team/*`, `@team-members/*`, `@enterprise/*`, `@enterpriseCategory/*`, `@enterpriseCategoryDetail/*`, `@ticket-historical/*`, `@ticketCard/*`, `@supervisor/*`, `@supervisorCategory/*`, `@parameter/*`.
- **`strictNullChecks` está desactivado** en `tsconfig.json`.

## Testing

Los tests unitarios usan Karma/Jasmine:

```powershell
npm test
```
