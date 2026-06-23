// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { chatConProlog } = require("../controllers/prologController");

// Ruta para el chat con Prolog
router.post("/", chatConProlog);

module.exports = router;