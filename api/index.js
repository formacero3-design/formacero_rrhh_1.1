import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import empleadosRoutes from "../backend/routes/empleados.routes.js";
import authRoutes from "../backend/routes/auth.routes.js";
import reportesRoutes from "../backend/routes/reportes.routes.js";

const app = express();

// 🔹 CORS - Actualizado para Vercel
const allowedOrigins = [
  /github\.dev$/,
  /githubpreview\.dev$/,
  /localhost(:\d+)?$/,
  /127\.0\.0\.1(:\d+)?$/,
  /\.vercel\.app$/,
  /formacero/i,
  process.env.FRONTEND_URL,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const allowed = allowedOrigins.some((pattern) => {
      if (typeof pattern === "string") return origin === pattern;
      return pattern.test(origin);
    });

    if (allowed) {
      callback(null, origin);
    } else {
      console.warn(`CORS bloqueado: ${origin}`);
      callback(null, true); // Permitir pero loguear
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// 🔹 MIDDLEWARES
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🔹 LOG (DEBUG)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// 🔹 RUTA BASE
app.get("/", (req, res) => {
  res.json({ status: "✅ API Formacero funcionando en Vercel" });
});

// 🔹 HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// 🔹 RUTAS PRINCIPALES
app.use("/api/empleados", empleadosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reportes", reportesRoutes);

// 🔴 404
app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
  });
});

// 🔴 ERRORES
app.use((err, req, res, next) => {
  console.error("🔥 ERROR GLOBAL:", err.message);

  if (err.message?.includes("CORS")) {
    return res.status(403).json({
      message: "Acceso bloqueado por CORS",
    });
  }

  res.status(500).json({
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

export default app;
