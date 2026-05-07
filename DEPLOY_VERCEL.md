# 🚀 Guía de Deploy en Vercel - Formacero RRHH

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Cuenta en [GitHub](https://github.com) (recomendado)
3. Git instalado localmente
4. Node.js 18+ instalado
5. Credenciales de Supabase
6. Variables de entorno configuradas

---

## 📚 Paso a Paso para Deploy en Vercel

### **PASO 1: Preparar el Repositorio Local**

```bash
# 1.1 Navega al directorio del proyecto
cd /workspaces/formacero_rrhh_1.1

# 1.2 Inicializa un repositorio Git si aún no lo has hecho
git init

# 1.3 Agrega todos los archivos
git add .

# 1.4 Realiza el primer commit
git commit -m "Preparar proyecto para Vercel"
```

---

### **PASO 2: Subir a GitHub**

```bash
# 2.1 Crear un nuevo repositorio en GitHub (no inicializar con README)
# https://github.com/new

# 2.2 Agregar el repositorio remoto
git remote add origin https://github.com/tu-usuario/formacero_rrhh.git

# 2.3 Cambiar rama a 'main' (si es necesario)
git branch -M main

# 2.4 Empujar los cambios a GitHub
git push -u origin main
```

---

### **PASO 3: Registrarse en Vercel**

1. Visita [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Elige opción de GitHub (recomendado)
4. Autoriza la conexión con GitHub

---

### **PASO 4: Crear un Nuevo Proyecto en Vercel**

1. En el dashboard de Vercel, haz clic en "New Project"
2. Selecciona "Import Git Repository"
3. Busca y selecciona `formacero_rrhh`
4. Haz clic en "Import"

---

### **PASO 5: Configurar Variables de Entorno en Vercel**

En la pantalla de configuración del proyecto antes de desplegar:

1. **Haz clic en "Environment Variables"**
2. **Agrega las siguientes variables:**

```
SUPABASE_URL = https://hztmmjbirqdpwigbxhth.supabase.co
SUPABASE_ANON_KEY = [tu_anon_key]
SUPABASE_SERVICE_ROLE_KEY = [tu_service_role_key]
JWT_SECRET = [tu_jwt_secret_super_seguro]
FRONTEND_URL = (se actualiza después del deploy)
EMAIL_USER = wilsonandres0826@gmail.com
EMAIL_PASS = [tu_app_password]
EMAIL_FROM = wilsonandres0826@gmail.com
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 465
NODE_ENV = production
```

---

### **PASO 6: Configurar Build y Desplegar**

1. **Deja que Vercel detecte la configuración automáticamente**
   - El archivo `vercel.json` contiene toda la configuración

2. **Verifica los siguientes valores en la UI de Vercel:**
   - **Build Command:** Debe ser similar a lo que dice en `vercel.json`
   - **Output Directory:** `formacero_rrhh_1.1/dist`

3. **Haz clic en "Deploy"**

4. **Espera a que el deploy finalice** (puede tomar 3-5 minutos)

---

### **PASO 7: Obtener la URL de Producción**

1. Una vez que el deploy finalice con ✅, verás:
   ```
   Production URL: https://tu-proyecto.vercel.app
   ```

2. **Actualiza la variable de FRONTEND_URL:**
   - Vuelve a Vercel → Settings → Environment Variables
   - Actualiza `FRONTEND_URL` con tu URL de producción
   - Espera a que se redepliegue automáticamente

---

### **PASO 8: Probar la Aplicación**

#### **Pruebas del Frontend:**
```bash
# 8.1 Abre en navegador:
https://tu-proyecto.vercel.app

# 8.2 Verifica que carga correctamente
# 8.3 Intenta hacer login
```

#### **Pruebas del Backend:**
```bash
# 8.4 Verifica el health check:
curl https://tu-proyecto.vercel.app/api/health

# Deberías recibir:
{
  "status": "ok",
  "timestamp": "2026-05-07T...",
  "uptime": 123.456
}
```

---

## ⚠️ Solución de Problemas Comunes

### **Error: "Build failed"**

**Solución:**
1. Verifica que `package.json` esté en `backend/` y `formacero_rrhh_1.1/`
2. Asegúrate de que todas las dependencias estén listadas en `package.json`
3. Revisa los logs en Vercel → Deployments → ver logs

### **Error: "API no responde" o "CORS bloqueado"**

**Solución:**
1. Verifica que `FRONTEND_URL` esté correctamente establecida
2. Revisa que el archivo `server.js` incluya tu dominio en `allowedOrigins`
3. Limpia el cache del navegador (Ctrl+Shift+Delete)

### **Error: "No se pueden cargar las imágenes"**

**Solución:**
- Las imágenes de uploads no se sincronizarán automáticamente
- Usa una solución como Cloudinary o AWS S3
- Actualmente, las imágenes se almacenan en `/uploads` que es efímero en Vercel

### **Error: "Variables de entorno no encontradas"**

**Solución:**
1. Redeploy el proyecto después de agregar variables:
   - Vercel → Deployments → Re-deploy
2. Verifica que las variables estén en el entorno correcto (Production)

---

## 📝 Cambios Realizados en el Código

### **1. Nuevo archivo: `api/index.js`**
- Punto de entrada para serverless functions
- Exporta la aplicación Express

### **2. Actualizado: `backend/server.js`**
- Ahora exporta `app` como módulo
- CORS actualizado para incluir dominios de Vercel
- Soporta ejecución local y en serverless

### **3. Nuevo archivo: `vercel.json`**
- Configura cómo Vercel construye el proyecto
- Define variables de entorno
- Configura rewrites para rutas de API

### **4. Actualizado: `vite.config.js`**
- Mejor configuración de build
- Soporte para sourcemaps en producción

---

## 🔧 Configuración Local (Desarrollo)

Si deseas probar localmente antes de desplegar:

```bash
# 1. Instalar dependencias
npm install
cd backend && npm install && cd ..
cd formacero_rrhh_1.1 && npm install && cd ../..

# 2. Crear archivo .env en backend/
# (Copia .env.example y actualiza las variables)

# 3. Ejecutar en desarrollo
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

---

## 🔒 Información Sensible

### **⚠️ IMPORTANTE:**
- **NUNCA** commits tus archivos `.env` a GitHub
- Usa `.env.example` como referencia
- Las variables sensibles deben estar solo en Vercel

### **Para GitHub:**
```bash
# Asegúrate de que .env esté en .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "Agregar .env a .gitignore"
git push
```

---

## 📊 Arquitectura en Vercel

```
formacero.vercel.app
├── Frontend (Static) - Vite React Build
│   └── /formacero_rrhh_1.1/dist/*
│
└── Backend (Serverless) - Express
    └── /api/* → api/index.js
```

---

## 🚀 Próximos Pasos (Después del Deploy)

1. **Configurar dominio personalizado:**
   - Vercel → Settings → Domains
   - Agregar tu dominio personalizado

2. **Configurar SSL:**
   - Vercel proporciona SSL automáticamente
   - Redirecciona HTTP → HTTPS

3. **Monitorear el proyecto:**
   - Vercel Analytics
   - Vercel Logs
   - Error tracking en Sentry (opcional)

4. **Configurar CI/CD automático:**
   - Los pushes a `main` se despliegan automáticamente
   - Puedes configurar preview deployments

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs en Vercel:**
   - Vercel Dashboard → Deployments → Click en último deploy → Logs

2. **Variables de entorno:**
   - Vercel Dashboard → Settings → Environment Variables

3. **Documentación de Vercel:**
   - https://vercel.com/docs

---

**Última actualización:** Mayo 7, 2026
