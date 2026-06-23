// ============================================
// server.js
// ============================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Conexión BD
const connectDB = require("./config/db");

// Rutas
const authRoutes = require("./routes/authRoutes");
const glucosaRoutes = require("./routes/glucosaRoutes");
const medicamentoRoutes = require("./routes/medicamentoRoutes");
const comidaRoutes = require("./routes/comidaRoutes");
const actividadRoutes = require("./routes/actividadRoutes");
const hidratacionRoutes = require("./routes/hidratacionRoutes");
const iaRoutes = require("./routes/iaRoutes");

// NUEVA RUTA PROLOG
const prologRoutes = require("./routes/prologRoutes");

// ============================================
// CONFIGURACIÓN
// ============================================

dotenv.config();

connectDB();

const app = express();

// ============================================
// MIDDLEWARES
// ============================================

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// LOG DE PETICIONES
// ============================================

app.use((req, res, next) => {

  console.log(
    `📡 ${req.method} ${req.originalUrl}`
  );

  next();

});

// ============================================
// RUTA PRINCIPAL
// ============================================

app.get("/", (req, res) => {

  res.json({
    mensaje: "API GlucoControl funcionando",
    version: "1.0.0",

    modulos: {
      autenticacion: "/api/auth",
      glucosa: "/api/glucosa",
      medicamentos: "/api/medicamentos",
      comidas: "/api/comidas",
      actividades: "/api/actividades",
      hidratacion: "/api/hidratacion",
      ia: "/api/ia",
      prolog: "/api/prolog"
    }
  });

});

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {

  res.status(200).json({
    estado: "OK",
    servidor: "Activo",
    fecha: new Date()
  });

});

// ============================================
// RUTAS API
// ============================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/glucosa",
  glucosaRoutes
);

app.use(
  "/api/medicamentos",
  medicamentoRoutes
);

app.use(
  "/api/comidas",
  comidaRoutes
);

app.use(
  "/api/actividades",
  actividadRoutes
);

app.use(
  "/api/hidratacion",
  hidratacionRoutes
);

app.use(
  "/api/ia",
  iaRoutes
);

// NUEVA RUTA PROLOG

app.use(
  "/api/prolog",
  prologRoutes
);

// ============================================
// RUTA NO ENCONTRADA
// ============================================

app.use((req, res) => {

  res.status(404).json({
    mensaje: "Ruta no encontrada",
    ruta: req.originalUrl
  });

});

// ============================================
// ERRORES
// ============================================

app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({
    mensaje: "Error interno del servidor"
  });

});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("\n=================================");
  console.log("🚀 GLUCOCONTROL API");
  console.log("=================================");
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log("=================================");
  console.log("📋 ENDPOINTS");
  console.log("GET  /");
  console.log("GET  /api/health");
  console.log("POST /api/auth/register");
  console.log("POST /api/auth/login");
  console.log("GET  /api/glucosa");
  console.log("POST /api/glucosa");
  console.log("GET  /api/medicamentos");
  console.log("POST /api/medicamentos");
  console.log("GET  /api/comidas");
  console.log("POST /api/comidas");
  console.log("GET  /api/actividades");
  console.log("POST /api/actividades");
  console.log("GET  /api/hidratacion");
  console.log("POST /api/hidratacion/vaso");
  console.log("POST /api/ia/chat");
  console.log("POST /api/prolog/analizar");
  console.log("=================================\n");

});