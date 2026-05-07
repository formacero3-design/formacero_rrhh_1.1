# 🏢 Formacero RRHH - Sistema de Gestión de Recursos Humanos

Sistema web integral para gestión de recursos humanos con dashboard, nómina, reportes y certificados laborales.

## 🎯 Características

- ✅ Autenticación y autorización con JWT
- ✅ Gestión de empleados
- ✅ Cálculo de nómina
- ✅ Generación de reportes
- ✅ Certificados laborales
- ✅ Sistema de vacaciones
- ✅ Gestión de documentos
- ✅ Panel administrativo

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Librería UI
- **Vite 7** - Build tool
- **React Router DOM 7** - Enrutamiento
- **HTML2PDF** - Generación de PDFs

### Backend
- **Node.js** - Runtime
- **Express 5** - Framework web
- **Supabase** - Base de datos PostgreSQL + autenticación
- **JWT** - Autenticación
- **Nodemailer** - Envío de correos
- **Multer** - Gestión de uploads
- **CORS** - Control de acceso

### Base de Datos
- **PostgreSQL** (via Supabase)
- Gestión automática de migraciones

### Hosting
- **Vercel** - Deploy de frontend + serverless backend
- **Supabase** - Base de datos en producción

---

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Git
- Cuenta en Supabase
- Cuenta en Vercel (para deploy)

---

## 🚀 Instalación y Ejecución Local

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/formacero_rrhh.git
cd formacero_rrhh_1.1
```

### 2️⃣ Crear Variables de Entorno

#### En la raíz del proyecto:
```bash
cp .env.example .env
```

#### En `backend/`:
```bash
cd backend
cp .env.example .env
```

#### En `formacero_rrhh_1.1/`:
```bash
cd ../formacero_rrhh_1.1
cp .env.example .env
```

### 3️⃣ Actualizar Variables de Entorno

**backend/.env:**
```env
SUPABASE_URL=tu_url_supabase
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
JWT_SECRET=tu_jwt_secreto
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_app
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 4️⃣ Instalar Dependencias

```bash
# En la raíz (si hay dependencias compartidas)
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd formacero_rrhh_1.1
npm install
cd ..
```

### 5️⃣ Ejecutar Localmente

#### Opción A: Ejecución separada (en diferentes terminales)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend corriendo en http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd formacero_rrhh_1.1
npm run dev
# Frontend corriendo en http://localhost:5173
```

#### Opción B: Ejecución concurrente

```bash
npm run dev
# Ejecuta ambos simultáneamente
```

---

## 📁 Estructura del Proyecto

```
formacero_rrhh_1.1/
├── api/                           ← Serverless API para Vercel
├── backend/                       ← API Express
│   ├── config/                   ← Configuración (Supabase)
│   ├── controllers/              ← Lógica de negocio
│   ├── middlewares/              ← Auth, CORS, etc.
│   ├── models/                   ← Esquemas de datos
│   ├── routes/                   ← Definición de rutas
│   ├── server.js                 ← Punto de entrada
│   └── package.json
│
├── formacero_rrhh_1.1/           ← Frontend Vite + React
│   ├── src/
│   │   ├── pages/                ← Componentes de páginas
│   │   ├── services/             ← Llamadas a API
│   │   ├── utils/                ← Funciones auxiliares
│   │   ├── assets/               ← Recursos estáticos
│   │   └── App.jsx               ← Componente raíz
│   ├── vite.config.js            ← Configuración de Vite
│   └── package.json
│
├── database/                      ← Scripts SQL
├── vercel.json                    ← Configuración de Vercel
├── DEPLOY_VERCEL.md              ← Guía de deploy
└── CAMBIOS_VERCEL.md             ← Resumen de cambios
```

---

## 🌐 Rutas de API

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Resetear contraseña

### Empleados
- `GET /api/empleados` - Listar empleados
- `GET /api/empleados/:id` - Obtener empleado
- `POST /api/empleados` - Crear empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado
- `GET /api/empleados/search` - Buscar empleados

### Reportes
- `GET /api/reportes/nómina` - Reporte de nómina
- `GET /api/reportes/empleados` - Reporte de empleados
- `GET /api/reportes/vacaciones` - Reporte de vacaciones

### Health Check
- `GET /api/health` - Estado del servidor

---

## 🔐 Autenticación

El proyecto usa JWT para autenticación:

1. Usuario envía credenciales a `/api/auth/login`
2. Backend valida contra Supabase
3. Backend retorna JWT
4. Cliente almacena token en `localStorage`
5. Token se envía en header `Authorization: Bearer <token>` en cada request

---

## 📊 Configuración de Supabase

### Tablas Requeridas
- `usuarios` - Usuarios del sistema
- `empleados` - Información de empleados
- `nómina` - Cálculos de nómina
- `reportes` - Reportes generados
- `vacaciones` - Período de vacaciones

Ejecuta `database/formacero.sql` para crear la estructura.

---

## 📧 Configuración de Email

El proyecto usa Nodemailer con Gmail:

1. Habilita 2FA en tu cuenta de Gmail
2. Genera una "App Password" en Google Account
3. Usa la App Password en `EMAIL_PASS`

---

## 🚀 Deploy en Vercel

Para desplegar en Vercel, sigue la guía completa en [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md).

### Resumen rápido:
```bash
# 1. Push a GitHub
git add .
git commit -m "Listo para Vercel"
git push

# 2. En Vercel:
# - Importar repositorio
# - Configurar variables de entorno
# - Deploy automático

# 3. Actualizar FRONTEND_URL
# - Después del primer deploy
# - Usar URL de Vercel: https://tu-proyecto.vercel.app
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to API"
- Verifica que el backend esté ejecutándose
- Revisa las variables de entorno en frontend
- Asegúrate de que CORS esté configurado

### Error: "Database connection failed"
- Verifica credenciales de Supabase
- Asegúrate de que la URL es correcta
- Revisa que la base de datos sea accesible

### Error: "Email not sent"
- Verifica credenciales de Gmail
- Asegúrate de que 2FA está habilitado
- Usa App Password, no contraseña regular

### En Vercel: "Build failed"
- Revisa logs en Vercel Dashboard
- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que `vercel.json` está en la raíz

---

## 📝 Scripts Disponibles

### Raíz del proyecto
```bash
npm run dev          # Ejecutar frontend y backend simultáneamente
npm run dev:backend  # Solo backend
npm run dev:frontend # Solo frontend
```

### Backend
```bash
npm start  # Ejecutar en producción
npm run dev # Ejecutar en desarrollo
```

### Frontend
```bash
npm run dev      # Modo desarrollo
npm run build    # Build para producción
npm run preview  # Previsualizar build
npm run lint     # Ejecutar linter
```

---

## 🔧 Configuración Avanzada

### Cloudinary para uploads
Para persistir uploads en producción:

1. Registrate en cloudinary.com
2. Obtén tus credenciales
3. Actualiza el controlador de uploads

### Custom Domain en Vercel
1. Vercel Dashboard → Settings → Domains
2. Agrega tu dominio
3. Sigue instrucciones de DNS

---

## 📚 Documentación Adicional

- [Guía de Deploy Vercel](./DEPLOY_VERCEL.md)
- [Resumen de Cambios](./CAMBIOS_VERCEL.md)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Vite](https://vite.dev)

---

## 👥 Contribuidores

- **Wilson Andrés** - Desarrollo principal

---

## 📄 Licencia

Este proyecto es propietario de Formacero.

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la documentación en este README
2. Consulta [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)
3. Revisa los logs en Vercel

---

**Última actualización:** Mayo 7, 2026
