// server.js - VERSIÓN ACTUALIZADA CON CORS PARA PRODUCCIÓN
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

// Rutas
const authRoutes = require("./routes/authRoutes");
const glucosaRoutes = require("./routes/glucosaRoutes");
const medicamentoRoutes = require("./routes/medicamentoRoutes");
const comidaRoutes = require("./routes/comidaRoutes");
const actividadRoutes = require("./routes/actividadRoutes");
const hidratacionRoutes = require("./routes/hidratacionRoutes");

// IA - Ruta de chat SIN IA (respuestas predefinidas)
const iaRoutes = require("./routes/iaRoutes");

// Cargar variables de entorno
dotenv.config();

// Conectar MongoDB
connectDB();

const app = express();

// ============================================
// MIDDLEWARES
// ============================================

// ============================================
// CONFIGURACIÓN CORS - ¡SOLUCIÓN DEFINITIVA!
// ============================================

// Permitir todas las origins (para producción)
app.use(cors({
  origin: '*', // ← PERMITE TODAS LAS ORIGINS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'Origin', 
    'X-Requested-With'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Manejar explícitamente las peticiones OPTIONS (preflight)
app.options('*', cors());

// Parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de peticiones (útil para depuración)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log('🔑 Token presente:', req.headers.authorization.substring(0, 30) + '...');
  }
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📦 Body:', req.body);
  }
  next();
});

// ============================================
// RUTA PRINCIPAL
// ============================================

app.get("/", (req, res) => {
  res.json({
    mensaje: "API GlucoControl funcionando",
    version: "1.0.0",
    modo: "SIN IA - Respuestas predefinidas",
    cors: "Habilitado para todas las origins",
    endpoints: {
      auth: "/api/auth",
      glucosa: "/api/glucosa",
      medicamentos: "/api/medicamentos",
      comidas: "/api/comidas",
      actividades: "/api/actividades",
      hidratacion: "/api/hidratacion",
      chat: "/api/ia/chat"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    modo: "sin_ia",
    database: "connected",
    cors: "enabled"
  });
});

// ============================================
// RUTAS DE LA API
// ============================================

// Autenticación
app.use("/api/auth", authRoutes);

// Glucosa
app.use("/api/glucosa", glucosaRoutes);

// Medicamentos
app.use("/api/medicamentos", medicamentoRoutes);

// Comidas
app.use("/api/comidas", comidaRoutes);

// Actividades físicas
app.use("/api/actividades", actividadRoutes);

// Hidratación
app.use("/api/hidratacion", hidratacionRoutes);

// IA - Chat con respuestas predefinidas (SIN IA externa)
app.use("/api/ia", iaRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Error 404 - Ruta no encontrada
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({
    mensaje: "Ruta no encontrada",
    ruta: req.url,
    metodo: req.method
  });
});

// Error 500 - Error interno del servidor
app.use((err, req, res, next) => {
  console.error("❌ Error interno:", err.stack);
  
  res.status(500).json({
    mensaje: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n========================================");
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log("========================================");
  console.log("📋 ENDPOINTS DISPONIBLES:");
  console.log(`   GET  /                          - Información general`);
  console.log(`   GET  /api/health                - Health check`);
  console.log(`   POST /api/auth/register         - Registro de usuario`);
  console.log(`   POST /api/auth/login            - Login de usuario`);
  console.log(`   GET  /api/auth/profile          - Perfil de usuario`);
  console.log(`   PUT  /api/auth/profile          - Actualizar perfil`);
  console.log(`   GET  /api/glucosa               - Obtener glucosa`);
  console.log(`   POST /api/glucosa               - Registrar glucosa`);
  console.log(`   GET  /api/medicamentos          - Obtener medicamentos`);
  console.log(`   POST /api/medicamentos          - Agregar medicamento`);
  console.log(`   GET  /api/comidas               - Obtener comidas`);
  console.log(`   POST /api/comidas               - Registrar comida`);
  console.log(`   GET  /api/actividades           - Obtener actividades`);
  console.log(`   POST /api/actividades           - Registrar actividad`);
  console.log(`   GET  /api/hidratacion           - Obtener hidratación`);
  console.log(`   POST /api/hidratacion/vaso      - Registrar vaso de agua`);
  console.log(`   POST /api/ia/chat               - Chat con respuestas predefinidas`);
  console.log(`   GET  /api/ia/test               - Probar chat`);
  console.log("========================================");
  console.log("🤖 MODO: SIN IA - Respuestas predefinidas");
  console.log("🌐 CORS: Habilitado para todas las origins");
  console.log("========================================\n");
});