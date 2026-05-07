# ⚡ Referencia Rápida - Formacero RRHH en Vercel

## 🚀 Desplegar Ahora

```bash
# 1. Asegúrate que está todo en Git
git add .
git commit -m "Preparar para Vercel"
git push origin main

# 2. En Vercel.com:
# - New Project
# - Connect GitHub
# - Busca: formacero_rrhh
# - Import
# - Agregar variables de .env.example
# - Deploy
```

---

## 🧪 Probar Localmente

```bash
# Terminal 1 - Backend
cd backend && npm run dev
# http://localhost:3001

# Terminal 2 - Frontend
cd formacero_rrhh_1.1 && npm run dev
# http://localhost:5173

# O ambos:
npm run dev
```

---

## 🔐 Variables de Entorno

```env
# Supabase
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Auth
JWT_SECRET=algo_super_seguro_aqui

# Email
EMAIL_USER=tu@gmail.com
EMAIL_PASS=tu_app_password
EMAIL_FROM=tu@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465

# URLs
FRONTEND_URL=https://tu-proyecto.vercel.app

# Sistema
NODE_ENV=production
PORT=3001
```

---

## 📁 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `vercel.json` | Config de Vercel |
| `api/index.js` | API serverless |
| `backend/server.js` | Backend (actualizado) |
| `DEPLOY_VERCEL.md` | **Guía paso a paso** |
| `CHECKLIST_DEPLOY.md` | Verificaciones |
| `CAMBIOS_VERCEL.md` | Cambios técnicos |

---

## 🌐 URLs Post-Deploy

```
https://tu-proyecto.vercel.app/           ← Frontend
https://tu-proyecto.vercel.app/api/health ← Health check
https://tu-proyecto.vercel.app/login      ← Login
```

---

## 🚨 Errores Comunes

### "CORS bloqueado"
→ Actualiza `FRONTEND_URL` en Vercel y redeploy

### "Build failed"
→ Revisa logs en Vercel → Deployments → Logs

### "API no responde"
→ Verifica variables de entorno en Vercel

### "Database connection failed"
→ Verifica credenciales Supabase

---

## ✅ Checklist Rápido

- [ ] `npm run dev` funciona localmente
- [ ] Push a GitHub exitoso
- [ ] Vercel conectado a GitHub
- [ ] Variables de entorno en Vercel
- [ ] Deploy sin errores
- [ ] API responde en /api/health
- [ ] Frontend carga sin errores
- [ ] Login funciona

---

## 📞 Documentos por Urgencia

| Urgencia | Lee Primero |
|----------|-------------|
| 🔴 URGENTE | `DEPLOY_VERCEL.md` - Paso a Paso |
| 🟡 IMPORTANTE | `CHECKLIST_DEPLOY.md` - Verificaciones |
| 🟢 INFORMACIÓN | `CAMBIOS_VERCEL.md` - Entender cambios |

---

## 💡 Pro Tips

### Redeploy rápido
```
Vercel Dashboard → Deployments → Re-deploy latest
```

### Ver logs
```
Vercel Dashboard → Deployments → Click en deploy → Logs
```

### Cambiar variables
```
Vercel Dashboard → Settings → Environment Variables
Luego: Re-deploy
```

### Preview deployments
```
Usa una branch diferente → Vercel crea preview automáticamente
```

---

## 🎯 Flujo de Deploy (5 pasos)

1. **Commit & Push**
   ```bash
   git add . && git commit -m "msg" && git push
   ```

2. **GitHub → Vercel automático**
   - Vercel ve cambios
   - Comienza build automático

3. **Vercel build**
   - Frontend build
   - Backend build
   - Deploy

4. **Prueba**
   ```bash
   curl https://tu-proyecto.vercel.app/api/health
   ```

5. **¡Listo!**
   - Aplicación en producción

---

## 🔗 Enlaces Útiles

- Vercel Dashboard: https://vercel.com
- GitHub: https://github.com
- Supabase: https://supabase.com
- Vercel Docs: https://vercel.com/docs
- NPM: https://www.npmjs.com

---

## 📊 Arquitectura

```
┌─────────────────────────────────────┐
│         Vercel (tu-app.vercel.app)  │
├─────────────────────────────────────┤
│  Frontend (Static)   │  Backend (API) │
│  React dist/        │  Node.js       │
│  HTML + JS + CSS    │  Express       │
└──────────┬──────────┴────────┬───────┘
           │                   │
           │                   │
        ┌──▼──────────────────▼──┐
        │   Supabase (PostgreSQL) │
        │   • Usuarios            │
        │   • Empleados           │
        │   • Nómina              │
        └─────────────────────────┘
```

---

## 🎓 Comandos Git Básicos

```bash
# Ver cambios
git status

# Agregar todo
git add .

# Verificar qué se va a commitear
git diff --cached

# Hacer commit
git commit -m "Mensaje descriptivo"

# Enviar a GitHub
git push origin main

# Ver historial
git log --oneline
```

---

## 💻 Comandos Node.js

```bash
# Instalar dependencias
npm install

# Ejecutar script
npm run dev

# Ver versión
npm --version

# Limpiar caché
npm cache clean --force
```

---

## 🆘 SOS Quick Help

| Problema | Comando |
|----------|---------|
| ¿Dónde están mis variables? | `cat backend/.env` |
| ¿Está instalado? | `npm list` |
| ¿Qué cambió? | `git status` |
| ¿Últimos commits? | `git log --oneline` |
| ¿Puedo revertir? | `git revert HEAD` |

---

## 🎉 ¡Lo Lograste!

Después de hacer deploy:

✅ Aplicación en Vercel
✅ Backend respondiendo
✅ Base de datos conectada
✅ Users pueden hacer login
✅ Sistema en producción

---

**Última referencia:** Mayo 7, 2026

👉 **LEER AHORA:** [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md)
