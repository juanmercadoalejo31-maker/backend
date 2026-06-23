// routes/prologRoutes.js
const express = require("express");
const router = express.Router();

const {
  analizarGlucosa,
  chatConProlog,
  obtenerRecomendacion,
  obtenerEstadoGeneral
} = require("../controllers/prologController");

// ============================================
// RUTAS PROLOG
// ============================================

// Analizar glucosa con Prolog
router.post("/analizar", analizarGlucosa);

// Chat con Prolog (para el asistente)
router.post("/chat", chatConProlog);

// Obtener recomendación específica
router.post("/recomendacion", obtenerRecomendacion);

// Obtener estado general del paciente
router.get("/estado", obtenerEstadoGeneral);

// ============================================
// EXPORTAR
// ============================================

module.exports = router;