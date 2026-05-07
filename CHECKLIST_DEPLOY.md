# ✅ Checklist Pre-Deploy Vercel

Este checklist te ayudará a asegurar que todo está listo antes de desplegar en Vercel.

## 🔍 Verificaciones Previas

### 📦 Dependencias
```bash
# Verificar que todas las dependencias están instaladas
# En cada carpeta:
cd backend && npm list
cd ../formacero_rrhh_1.1 && npm list
```
- [ ] Todas las dependencias instaladas sin errores

### 📝 Archivos Requeridos
- [ ] `vercel.json` existe en la raíz
- [ ] `api/index.js` creado
- [ ] `.gitignore` actualizado con `.env`
- [ ] `backend/.env` con variables reales
- [ ] `formacero_rrhh_1.1/.env` con variables (si es necesario)
- [ ] `DEPLOY_VERCEL.md` presente
- [ ] `CAMBIOS_VERCEL.md` presente

### 🔐 Variables de Entorno
- [ ] `SUPABASE_URL` configurada
- [ ] `SUPABASE_ANON_KEY` configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada
- [ ] `JWT_SECRET` es algo único y seguro
- [ ] `EMAIL_USER` configurado
- [ ] `EMAIL_PASS` es Password de App (no contraseña regular)
- [ ] `FRONTEND_URL` es tempoal (se actualizará después)

### 🧪 Pruebas Locales

```bash
# Terminal 1
cd backend && npm run dev
```
```bash
# Terminal 2
cd formacero_rrhh_1.1 && npm run dev
```

- [ ] Backend inicia sin errores
- [ ] Frontend inicia sin errores
- [ ] Backend responde a `http://localhost:3001/health`
- [ ] Frontend carga en `http://localhost:5173`
- [ ] Página de login carga correctamente
- [ ] Puedes hacer login sin errores CORS
- [ ] Las llamadas a API funcionan
- [ ] Console del navegador sin errores

### 🔐 Security Checks

- [ ] `.env` está en `.gitignore`
- [ ] `.env.local` está en `.gitignore`
- [ ] No hay credenciales en archivos .js
- [ ] No hay conexiones hardcodeadas a localhost en build
- [ ] JWT_SECRET es suficientemente largo y aleatorio

### 📂 Git & GitHub

```bash
# Verificar estado
git status

# Agregar cambios
git add .

# Ver qué se va a commitear
git diff --cached

# Commit
git commit -m "Preparar proyecto para Vercel"

# Push
git push origin main
```

- [ ] Todos los cambios están commiteados
- [ ] Ningún archivo `.env` en git
- [ ] README está actualizado
- [ ] `git push` exitoso

---

## 🚀 En Vercel

### Creación del Proyecto

1. Visita https://vercel.com
   - [ ] Loguéado con GitHub

2. Haz clic en "New Project"
   - [ ] Selecciona "Import Git Repository"

3. Busca `formacero_rrhh`
   - [ ] Repositorio encontrado
   - [ ] Rama correcta (main)

4. Haz clic en "Import"
   - [ ] Proyecto importado exitosamente

### Configuración Pre-Deploy

En la pantalla de configuración (ANTES de hacer Deploy):

**Environment Variables:**
```
Agregar todas las variables de .env.example
```

- [ ] `SUPABASE_URL` agregada
- [ ] `SUPABASE_ANON_KEY` agregada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` agregada
- [ ] `JWT_SECRET` agregada
- [ ] `EMAIL_USER` agregada
- [ ] `EMAIL_PASS` agregada
- [ ] `EMAIL_FROM` agregada
- [ ] `EMAIL_HOST` agregada
- [ ] `EMAIL_PORT` agregada
- [ ] `FRONTEND_URL=https://formacero-rrhh.vercel.app` (ajustar según tu nombre)
- [ ] `NODE_ENV=production`

**Build Settings:**
- [ ] Build Command: Automático (desde vercel.json)
- [ ] Output Directory: `formacero_rrhh_1.1/dist`
- [ ] Install Command: Automático (desde vercel.json)

### Deploy

1. Haz clic en "Deploy"
   - [ ] Inicio del deploy

2. Monitorea el progreso
   - [ ] Frontend build exitoso
   - [ ] Backend build exitoso
   - [ ] Deployment exitoso ✅

3. Espera a que finalice
   - [ ] Obtén la URL: `https://tu-proyecto.vercel.app`

---

## 🧪 Pruebas Post-Deploy

### Frontend
```
Visita: https://tu-proyecto.vercel.app
```
- [ ] Página carga sin errores 404
- [ ] Estilos CSS cargan correctamente
- [ ] Imágenes cargan correctamente
- [ ] Logo y assets se ven bien
- [ ] No hay errores en Console (F12)

### Backend
```bash
curl https://tu-proyecto.vercel.app/api/health

# Respuesta esperada:
# {
#   "status": "ok",
#   "timestamp": "2026-05-07T..."
# }
```
- [ ] Endpoint `/api/health` responde con 200
- [ ] Respuesta válida

### Funcionalidad de Login
- [ ] Página de login carga
- [ ] Puedo ingresar email y contraseña
- [ ] Error si credenciales incorrectas
- [ ] Success si credenciales correctas
- [ ] JWT se guarda en localStorage
- [ ] Pasa a dashboard después de login

### API Calls
- [ ] Llamadas a `/api/empleados` funcionan
- [ ] Llamadas a `/api/auth/*` funcionan
- [ ] CORS no bloquea las llamadas
- [ ] Tiempos de respuesta aceptables

### Emails (si hay funcionalidad)
- [ ] Correos de recuperación de contraseña funcionan
- [ ] Correos se reciben en bandeja de entrada

---

## 🔧 Post-Deploy Fixes (si es necesario)

### Si hay error de CORS:
1. Vercel Dashboard → Settings → Environment Variables
2. Actualiza `FRONTEND_URL` con la URL exacta de Vercel
3. Redeploy:
   ```
   Vercel → Deployments → último → Re-deploy
   ```

### Si hay error de build:
1. Vercel Dashboard → Deployments → último draft
2. Haz clic en "Logs"
3. Busca el error
4. Corrige en local
5. Push a GitHub
6. Vercel redeployará automáticamente

### Si las variables no se aplican:
1. Vercel Dashboard → Settings → Environment Variables
2. Verifica que están en el entorno "Production"
3. Deployment manual:
   ```
   Vercel → Deployments → Haz clic en último → Re-deploy
   ```

---

## 🎯 URL Post-Deploy

Después de que el deploy finalice:

1. **Tu aplicación estará en:**
   ```
   https://tu-proyecto-name.vercel.app
   ```

2. **Actualiza FRONTEND_URL:**
   - [ ] Ve a Vercel → Settings → Environment Variables
   - [ ] Busca `FRONTEND_URL`
   - [ ] Actualízala a tu URL full: `https://tu-proyecto-name.vercel.app`
   - [ ] Guarda cambios
   - [ ] Vercel redeploya automáticamente

3. **Dominio personalizado (opcional):**
   - [ ] Vercel → Settings → Domains
   - [ ] Agrega tu dominio personalizado
   - [ ] Sigue instrucciones de DNS de tu registrador

---

## 📊 Monitoreo Post-Deploy

### Logs en Vercel:
- [ ] Vercel → Deployments → Click en tu proyecto
- [ ] Revisa "Function Logs" para errores del backend
- [ ] Revisa "Build Logs" para errores de compilación

### Sentry (Opcional - para error tracking):
```bash
# Instalar Sentry
npm install @sentry/react @sentry/vite-plugin

# Configurar en main.jsx
```

---

## ✨ Próximos Pasos (Después de Deploy)

### Inmediato
- [ ] Documentar la URL de Vercel
- [ ] Compartir URL con stakeholders
- [ ] Hacer pruebas finales en producción
- [ ] Recolectar feedback de usuarios

### Corto Plazo
- [ ] Configurar dominio personalizado
- [ ] Configurar SSL certificate (Vercel lo hace automático)
- [ ] Configurar analytics (Vercel Analytics)
- [ ] Configurar error tracking (Sentry)

### Medio Plazo
- [ ] Implementar solución de uploads (Cloudinary/S3)
- [ ] Configurar CI/CD más avanzado
- [ ] Implementar auto-deploy en push
- [ ] Configurar preview deployments

---

## 🚨 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Build failed | Revisa logs, verifica dependencies |
| CORS error | Actualiza FRONTEND_URL y redeploy |
| API no responde | Verifica variables de entorno |
| Imagenes no cargan | Revisa rutas relativas en build |
| Email no funciona | Verifica EMAIL_PASS es App Password |
| Base de datos error | Verifica credenciales Supabase |

---

## 📞 Recursos de Ayuda

- Vercel Docs: https://vercel.com/docs
- Vercel Status: https://www.vercel-status.com
- Community: https://github.com/vercel/vercel/discussions
- Supabase Docs: https://supabase.com/docs

---

**Última actualización:** Mayo 7, 2026
