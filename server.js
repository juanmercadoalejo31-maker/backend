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

// NUEVA RUTA CHAT
const chatRoutes = require("./routes/chatRoutes");

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
      prolog: "/api/prolog",
      chat: "/api/chat"
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

// RUTA PROLOG
app.use(
  "/api/prolog",
  prologRoutes
);

// RUTA CHAT
app.use(
  "/api/chat",
  chatRoutes
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
  console.log("📋 ENDPOINTS DISPONIBLES");
  console.log("=================================");
  console.log("📌 PRINCIPALES");
  console.log("GET  /");
  console.log("GET  /api/health");
  console.log("");
  console.log("📌 AUTENTICACIÓN");
  console.log("POST /api/auth/register");
  console.log("POST /api/auth/login");
  console.log("");
  console.log("📌 GLUCOSA");
  console.log("GET  /api/glucosa");
  console.log("POST /api/glucosa");
  console.log("");
  console.log("📌 MEDICAMENTOS");
  console.log("GET  /api/medicamentos");
  console.log("POST /api/medicamentos");
  console.log("PUT  /api/medicamentos/:id");
  console.log("DELETE /api/medicamentos/:id");
  console.log("");
  console.log("📌 COMIDAS");
  console.log("GET  /api/comidas");
  console.log("POST /api/comidas");
  console.log("PUT  /api/comidas/:id");
  console.log("DELETE /api/comidas/:id");
  console.log("");
  console.log("📌 ACTIVIDADES");
  console.log("GET  /api/actividades");
  console.log("POST /api/actividades");
  console.log("");
  console.log("📌 HIDRATACIÓN");
  console.log("GET  /api/hidratacion");
  console.log("POST /api/hidratacion/vaso");
  console.log("");
  console.log("📌 IA");
  console.log("POST /api/ia/chat");
  console.log("");
  console.log("📌 PROLOG");
  console.log("POST /api/prolog/analizar");
  console.log("POST /api/prolog/chat");
  console.log("POST /api/prolog/recomendacion");
  console.log("GET  /api/prolog/estado");
  console.log("");
  console.log("📌 CHAT");
  console.log("POST /api/chat");
  console.log("=================================\n");

});