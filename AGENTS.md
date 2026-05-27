# PillaDoc - Medical Management Platform

## Stack
- Angular 19.2 (Standalone Components, Signals)
- Bootstrap 5 (grid, utilities only)
- Angular Material (buttons, icons, spinners, cards, inputs)
- API: PHP CodeIgniter (`/srv/www/htdocs/sincrodoc/`)

## API Base
`http://localhost/sincrodoc/api/`

## Auth Endpoints
- `loginprv` - POST: user, password → proveedor login (sprvuser)
- `logincli` - POST: user, password → cliente login (scliuser)
- `login_google_medico` - POST: google_token → Google auth
- `guardar_proveedor` - POST: multi-part → register doctor
- `guardar_cliente` - POST: multi-part → register patient

## Public Endpoints
- `listar_publico` - GET/POST: search, especialidad, estado, page, limit → doctor directory
- `perfil_publico` - GET/POST: proveed | slug → doctor profile detail
- `buscagrupoprv` - GET → all specialties (grpr table)
- `estados` - POST: search → Venezuelan states
- `municipios` - POST: estado_id → municipalities

## Auth Methods
- `loginprv` authenticates against `sprvuser` table, returns JWT with `tipo_u: 'P'`
- `logincli` authenticates against `scliuser` table, returns JWT with `tipo_u: 'C'`
- Token stored in localStorage as `token`

## Database Tables
- `sprv` - Providers/Doctors (proveed PK, nombre, email, telefono, rif, grupo→grpr, direc2, direc3, foto, about, redes, color_theme, url)
- `grpr` - Provider groups/specialties (grupo PK, gr_desc)
- `sprvuser` - Provider users (us_codigo PK, proveed→sprv, us_nombre, email, us_clave, activo, us_proveed, google_id, foto)
- `sprv_profile` - Extended profiles (proveed PK, clinicas JSON, horarios JSON, servicios JSON, banner, foto)
- `scli` - Clients (cliente PK, nombre, email, telefono, rif, direc2, direc3)
- `scliuser` - Client users (us_codigo PK, cliente→scli, us_nombre, email, us_clave, activo)

## Routes
- `/` - HomePage (landing, hero, benefits, featured doctors, CTA)
- `/servicios` - ServicesPage (service catalog)
- `/doctores` - DoctorsPage (searchable directory with filters)
- `/doctor/:slug` - DoctorProfilePage (public profile from API)
- `/auth/login` - LoginComponent (medic/patient tabs)
- `/auth/register` - RegisterComponent (full registration form)
- `/auth/onboarding` - OnboardingComponent (post-registration tutorial)
- `/dashboardprv` - DashboardprvPage (provider panel: stats, appointments, profile)
- `/authprv` - AuthprvPage (legacy provider login/register)
- `/:slug` - PerfilPage (public doctor profile by slug)

## Color Theme
- Primary: `#0A6E6E` (medical teal)
- Dark: `#0f172a` (navy)
- Accent: `#119999`
- Success: `#22c55e`
- Light bg: `#f8fafc`
- Card bg: `#ffffff`
- Dark mode: `#020617` bg, `#0b1329` cards

## Component Structure
```
src/
├── app/
│   ├── core/auth/
│   │   └── auth.interceptor.ts
│   ├── features/auth/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   ├── register/
│   │   │   ├── register.component.ts
│   │   │   ├── register.component.html
│   │   │   └── register.component.scss
│   │   └── onboarding/
│   │       ├── onboarding.component.ts
│   │       ├── onboarding.component.html
│   │       └── onboarding.component.scss
│   ├── pages/
│   │   ├── home-page/
│   │   ├── services-page/
│   │   ├── doctors-page/
│   │   ├── doctor-profile-page/
│   │   ├── dashboardprv/
│   │   │   ├── dashboardprv.ts
│   │   │   ├── dashboardprv.html
│   │   │   ├── dashboardprv.scss
│   │   │   ├── services/
│   │   │   │   ├── doctor-profile.service.ts
│   │   │   │   └── medical-dashboard.ts
│   │   │   └── components/profile/
│   │   ├── authprv-page/
│   │   ├── perfil-page/
│   │   └── dashboardprv-page/ (legacy)
│   ├── components/
│   │   ├── navbar/
│   │   └── footer/
│   ├── auth.service.ts (root - enhanced with signals)
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.routes.server.ts
```

## Build Commands
- `npm run build` - Production build
- `ng serve` - Dev server
- `npm run build:ssr` - SSR build
