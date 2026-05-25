# 📊 Análisis Completo Proyecto Formacero RRHH 1.1

## 🎯 Resumen Ejecutivo

**Formacero RRHH** es un Sistema de Gestión de Recursos Humanos completo, full-stack, desplegable en Vercel con:
- **Frontend**: React 19 + Vite + React Router
- **Backend**: Node.js/Express 5 + Supabase
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: JWT + bcrypt
- **Almacenamiento**: Supabase Storage

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React/Vite)                      │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │ Login    │Dashboard │ Empleados│ Reportes │Certificado│  │
│  │ Nómina   │Organigra │ Detalle  │Exempleados│Recuperar│  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
│          ↓ HTTP/REST ↓ (fetchWithAuth)                      │
├─────────────────────────────────────────────────────────────┤
│                  API (Express.js)                           │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ Auth Routes  │ Empleados    │ Reportes     │            │
│  │ /login       │ /CRUD        │ /CRUD        │            │
│  │ /forgot-pwd  │ /search      │ /responder   │            │
│  │ /reset-pwd   │ /certificado │              │            │
│  └──────────────┴──────────────┴──────────────┘            │
│          ↓ Supabase JS ↓                                    │
├─────────────────────────────────────────────────────────────┤
│              SUPABASE (PostgreSQL + Storage)                │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ Tablas       │ Storage      │ Auth         │            │
│  │ - usuarios   │ - empleados/ │ - JWT verify │            │
│  │ - empleados  │   fotos/     │              │            │
│  │ - reportes   │   docs/      │              │            │
│  │ - deptos     │              │              │            │
│  │ - etc        │              │              │            │
│  └──────────────┴──────────────┴──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Backend - Estructura de Archivos

### Configuración
| Archivo | Propósito |
|---------|-----------|
| `server.js` | Servidor Express principal, CORS, middlewares, rutas |
| `config/supabase.js` | Inicialización cliente Supabase con validación |
| `package.json` | Dependencias: Express, Supabase, JWT, bcrypt, Multer, Nodemailer |

### Controladores (Lógica de Negocio)
| Archivo | Funciones |
|---------|-----------|
| `controllers/auth.controller.js` | `login()`, `forgotPassword()`, `resetPassword()` |
| `controllers/empleados.controller.js` | CRUD empleados, búsqueda, documentos, contactos emergencia, certificados |
| `controllers/reportes.controller.js` | CRUD reportes, respuestas de empleados |

### Rutas
| Archivo | Endpoints |
|---------|-----------|
| `routes/auth.routes.js` | POST /login, /forgot-password, /reset-password |
| `routes/empleados.routes.js` | GET/POST/PUT/DELETE empleados, búsqueda, documentos |
| `routes/reportes.routes.js` | GET/POST/PUT/DELETE reportes, /responder |

### Middlewares
| Archivo | Función |
|---------|---------|
| `middlewares/auth.middleware.js` | `verifyToken()` - Valida JWT en Authorization header |
| `middlewares/roleAuth.js` | `requireAdmin()` - Verifica rol === 'admin' |

---

## 🎨 Frontend - Estructura de Páginas

### Páginas Principales

#### **Login** (`src/pages/login/login.jsx`)
- Formulario: correo + contraseña
- POST `/api/auth/login`
- Almacena token y usuario en localStorage
- Redirige según rol (admin → /dashboard, user → /empleado/:id)

#### **Dashboard** (`src/pages/dashboard/dashboard.jsx`)
- Bienvenida personalizada
- Buscador de empleados en tiempo real
- Para admins: Gestión de reportes (crear, editar, eliminar, cambiar estado)
- Stats: Total de empleados, cumpleaños del mes

#### **Registrar Empleados** (`src/pages/registrar-empleados/registrar-empleados.jsx`)
- Formulario completo: nombre, cédula, correo, cargo, salario, fechas
- Upload de foto (max 2MB) y documentos (max 10 archivos)
- Contacto de emergencia (nested form)
- POST `/api/empleados` con FormData multipart

#### **Nómina** (`src/pages/nomina/nomina.jsx`)
- Seleccionar empleado
- Ingresar días trabajados
- Calcular: (salario/30) × días
- Generar PDF del desprendible (html2pdf.js)

#### **Reportes** (`src/pages/reportes/reportes.jsx`)
- Tab de formulario: Crear reporte para 1 o TODOS los empleados
- Tab de listado: Ver, editar, eliminar reportes
- Estados: pendiente, resuelto
- POST/PUT/DELETE `/api/reportes`

#### **Empleado Detalle** (`src/pages/empleado-detalle/empleado-detalle.jsx`)
- Información básica
- Editar perfil y foto (si es admin o dueño)
- Gestión de documentos (subir, editar, eliminar)
- Contactos de emergencia (crear, editar, eliminar)
- Ver reportes asignados y responder con archivo
- Permisos granulares por rol

#### **Certificado Laboral** (`src/pages/certificado-laboral/certificado-laboral.jsx`)
- Generar certificado con formato legal
- Auto-seleccionar para empleados, dropdown para admins
- Copiar al portapapeles
- Descargar como .txt

#### **Organización** (`src/pages/organizacion/organizacion.jsx`)
- Organigrama visual en tarjetas
- Mostrar nombre, cargo, departamento, foto
- Clickear tarjeta navega a detalle del empleado

#### **Información Empleados** (`src/pages/informacion-empleados/informacion-empleados.jsx`)
- Tabla expandible de empleados activos
- Búsqueda por nombre, cargo, departamento
- Ver documentos
- Eliminar empleado (→ ex-empleados)

#### **Lista Ex-Empleados** (`src/pages/lista-exempleados/lista-exempleados.jsx`)
- Tabla de empleados retirados/despedidos
- Expandir para ver razón
- Eliminar definitivamente del sistema

#### **Forgot Password** (`src/pages/forgot-password/forgot-password.jsx`)
- Formulario con email
- POST `/api/auth/forgot-password`
- Recibe email de reset

#### **Reset Password** (`src/pages/reset-password/reset-password.jsx`)
- Token en URL params
- Formulario nueva contraseña
- POST `/api/auth/reset-password`

### Utilidades

**`src/utils/api.js`**
```javascript
export const API = buildApiUrl();  // Construye URL base
export const getApiEndpoint(endpoint)  // Retorna URL completa
export const getAuthHeaders()  // Headers con token JWT
export const fetchWithAuth()  // Wrapper fetch con token
```

---

## 🗄️ Base de Datos - Tablas Supabase

### Usuarios
```sql
id, nombre, correo, password (bcrypt), rol, empleado_id, foto_url
```

### Empleados (Principal)
```sql
id, nombre, documento, correo, telefono, cargo, salario,
fecha_ingreso, fecha_nacimiento, departamento_id, direccion,
estado, foto_url, fecha_creacion
```

### Departamentos
```sql
id, nombre
-- Se crean automáticamente en createEmpleado si no existen
```

### Documentos_Empleado
```sql
id, empleado_id (FK), nombre_original, tipo (MIME),
url (Supabase Storage), fecha_subida
```

### Contactos_Emergencia
```sql
id, empleado_id (FK), nombre, relacion, telefono_principal,
telefono_alternativo, direccion, ciudad
-- Tabla con RLS en Supabase
```

### Exempleados
```sql
id, nombre, correo, cargo, departamento, telefono,
fecha_ingreso, fecha_salida, razon_despido
```

### Reportes
```sql
id, empleado_id (FK), descripcion, fecha, estado,
decision, respuesta_empleado, archivo_excusa, fecha_respuesta
```

### Organizacion (No completamente utilizada)
```sql
id, empleado_id (FK), jefe_id (FK), rol
```

---

## 🔐 Flujos de Autenticación

### Login Normal
```
Usuario ingresa credenciales
        ↓
Frontend: POST /api/auth/login
        ↓
Backend: Busca usuario en tabla 'usuarios'
        ↓
Backend: bcrypt.compare(password, user.password)
        ↓
Backend: Genera JWT { id, rol, empleado_id } - 8h expiración
        ↓
Frontend: Almacena en localStorage (token, user)
        ↓
Redirige: admin → /dashboard, empleado → /empleado/:id
```

### Recuperación de Contraseña
```
Usuario: /forgot-password → ingresa correo
        ↓
Backend: Busca usuario, genera token reset aleatorio
        ↓
Backend: Envía email con link /reset-password?token=...
        ↓
Usuario: Recibe email, hace clic
        ↓
Usuario: /reset-password → ingresa nueva contraseña
        ↓
Backend: Valida token, hashea password, actualiza
        ↓
Usuario: Puede hacer login con nueva contraseña
```

---

## 🚀 Endpoints API Completos

### Autenticación
```
POST   /api/auth/login                    - Autentica usuario
POST   /api/auth/forgot-password          - Inicia recuperación
POST   /api/auth/reset-password           - Completa reset
GET    /api/auth/test                     - Health check auth
```

### Empleados (Requiere token)
```
GET    /api/empleados                     - Lista todos
GET    /api/empleados/:id                 - Obtiene uno
POST   /api/empleados                     - Crea (multipart)
PUT    /api/empleados/:id                 - Actualiza (multipart foto)
DELETE /api/empleados/:id                 - Elimina (→ exempleado)
GET    /api/empleados/search?q=...        - Busca
GET    /api/empleados/count               - Cuenta total
GET    /api/empleados/cumpleaneros        - Cumpleaños mes
GET    /api/empleados/exempleados         - Lista ex-empleados
DELETE /api/empleados/exempleados/:id     - Elimina ex-empleado
GET    /api/empleados/certificado/:id     - Certificado
POST   /api/empleados/:id/documentos      - Sube documento
PUT    /api/empleados/:id/documentos/:docId - Actualiza doc
DELETE /api/empleados/:id/documentos/:docId - Elimina doc
POST   /api/empleados/:id/contacto-emergencia - Crea contacto
PUT    /api/empleados/:id/contacto-emergencia/:contactoId - Actualiza
DELETE /api/empleados/:id/contacto-emergencia/:contactoId - Elimina
```

### Reportes (Requiere token)
```
GET    /api/reportes                      - Lista (filtrado si no admin)
POST   /api/reportes                      - Crea (admin only)
PUT    /api/reportes/:id                  - Actualiza (admin only)
DELETE /api/reportes/:id                  - Elimina (admin only)
POST   /api/reportes/:id/responder        - Empleado responde (multipart)
```

---

## 📋 Variables de Entorno Requeridas

```env
# Supabase
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT
JWT_SECRET=algo_super_seguro_aqui_minimo_32_caracteres

# Email (Gmail SMTP)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=app_password_generada_en_gmail
EMAIL_FROM=tu_email@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465

# URLs
FRONTEND_URL=https://tu-app.vercel.app
VITE_API_URL=https://tu-app.vercel.app/api (frontend)

# Sistema
NODE_ENV=production
PORT=3001
```

---

## 🚢 Deployment en Vercel

### Archivos de Configuración
- **`vercel.json`**: Config de Vercel
  - Build: `cd formacero_rrhh_1.1 && npm run build`
  - Output: `formacero_rrhh_1.1/dist`
  - Rewrites: `/api/*` → `/api`, `/*` → `/`

- **`api/index.js`**: Entrada para serverless functions
  - Re-importa rutas de backend
  - Compatible con Vercel

### Pasos Deploy
1. Push a GitHub
2. Conectar repo en Vercel
3. Agregar variables de entorno
4. Deploy automático

---

## 🔄 Flujos de Datos Principales

### Crear Empleado
```
Admin completa formulario
        ↓
Sube foto (max 2MB) + documentos
        ↓
Frontend: POST /api/empleados (FormData multipart)
        ↓
Backend: createEmpleado()
        ↓
Sube a Supabase Storage bucket 'empleados'
        ↓
Inserta en tabla 'empleados'
        ↓
Retorna ID del empleado creado
        ↓
Frontend: Mensaje de éxito, limpia formulario
```

### Crear Reporte
```
Admin selecciona empleado(s) y describe reporte
        ↓
Opción: 1 empleado o TODOS
        ↓
Frontend: POST /api/reportes
        ↓
Backend: createReporte() - inserta en tabla 'reportes'
        ↓
Empleado ve reporte en /empleado/:id → reportes
```

### Responder Reporte
```
Empleado ve reporte en su perfil
        ↓
Ingresa respuesta (texto) y opcionalmente archivo
        ↓
Frontend: POST /api/reportes/:id/responder (multipart)
        ↓
Backend: responderReporte()
        ↓
Almacena respuesta, archivo en storage
        ↓
Actualiza respuesta_empleado, archivo_excusa, fecha_respuesta
```

---

## 🎯 Permisos por Rol

| Acción | Admin | Empleado |
|--------|-------|----------|
| Ver todos los empleados | ✅ | ❌ |
| Ver su perfil | ✅ | ✅ |
| Editar su perfil | ✅ | ✅ |
| Editar perfil de otros | ✅ | ❌ |
| Crear empleados | ✅ | ❌ |
| Crear reportes | ✅ | ❌ |
| Ver reportes de todos | ✅ | ❌ |
| Ver sus propios reportes | ✅ | ✅ |
| Responder reporte propio | ✅ | ✅ |
| Editar/eliminar reporte | ✅ | ❌ |
| Ver ex-empleados | ✅ | ❌ |
| Generar certificado | ✅ | ✅ (solo el suyo) |
| Descargar nómina | ✅ | ❌ |

---

## 📝 Notas Técnicas Importantes

### Adaptador de BD
- `backend/db.js` traduce SQL MySQL → Supabase - en transición gradual
- Nueva código usa Supabase JS directamente en controllers

### Servicios Vacíos
- `src/services/api.js`, `auth.js`, `empleados.js` están vacíos
- Toda la lógica está integrada en componentes de página
- **Mejora sugerida**: Mover a proper service layer

### Modelos Vacíos
- No hay `backend/models/` implementados
- Lógica directamente en controllers
- **Mejora sugerida**: Crear models para validación y lógica reutilizable

### Autenticación JWT
- Token dura 8 horas
- Almacenado en localStorage
- Enviado en header: `Authorization: Bearer <token>`

### Upload de Archivos
- **Empleados**: Supabase Storage bucket 'empleados'
- **Reportes**: Multer en `/tmp` (Vercel) o `backend/uploads` (local)
- Fotos max 2MB, documentos max 50MB

### CORS Dinámico
Permite:
- localhost y 127.0.0.1
- GitHub Codespaces
- Dominios Vercel (*.vercel.app)
- Dominios con 'formacero'
- Variable FRONTEND_URL

### Email
- Requiere Gmail + App Password (no contraseña normal)
- SMTP en puerto 465 (SSL)
- Usado para recuperación de contraseña

---

## 🔧 Desarrollo Local

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# http://localhost:3001

# Terminal 2 - Frontend
cd formacero_rrhh_1.1
npm install
npm run dev
# http://localhost:5173

# O ambos simultáneamente
npm run dev
```

---

## 📚 Archivos de Documentación Incluidos

- **DEPLOY_VERCEL.md**: Guía paso a paso para deploy
- **CAMBIOS_VERCEL.md**: Cambios técnicos realizados
- **REFERENCIA_RAPIDA.md**: Comandos rápidos
- **CHECKLIST_DEPLOY.md**: Verificaciones pre-deploy
- **README.md**: Documentación general
- **INDICE.md**: Índice de documentación

---

## 🎓 Tecnologías Stack Completo

```
Frontend:  React 19 → Vite → React Router 7 → html2pdf.js
API:       Express 5 → Node.js → Multer
DB:        Supabase (PostgreSQL) + Supabase Storage
Auth:      JWT + bcrypt (6.0.0)
Email:     Nodemailer + Gmail SMTP
Deploy:    Vercel (Frontend + API Serverless)
```

---

## ✅ Características Principales Implementadas

✅ Autenticación completa (login, forgot-pwd, reset-pwd)
✅ CRUD empleados con foto y documentos
✅ Búsqueda en tiempo real
✅ Reportes disciplinarios
✅ Respuestas de empleados a reportes
✅ Nómina con cálculos automáticos
✅ Certificados laborales
✅ Organigrama visual
✅ Gestión de ex-empleados
✅ Contactos de emergencia
✅ Roles y permisos (admin vs empleado)
✅ Respaldo en Supabase
✅ Deploy en Vercel

---

## 🚀 Próximas Mejoras Sugeridas

1. Implementar Service Layer para lógica reutilizable
2. Agregar validación más robusta en backend
3. Implementar paginación en listas grandes
4. Agregar caché (localStorage, React Query, Redux)
5. Mejorar manejo de errores global
6. Implementar logging centralizado
7. Agregar auditoría de cambios
8. Documentar API con Swagger/OpenAPI
9. Tests unitarios y e2e
10. Mejorar UX con modales, confirmaciones

---

**Análisis generado:** 25-05-2026
**Última actualización del análisis:** Mismo código fuente leído
