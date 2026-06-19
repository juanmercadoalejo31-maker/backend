// routes/iaRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { chatIA } = require('../controllers/iaController');

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({
    mensaje: '✅ Chat funcionando SIN IA',
    timestamp: new Date().toISOString(),
    modo: 'respuestas_predefinidas'
  });
});

// Ruta de prueba con autenticación
router.get('/test-auth', authMiddleware, (req, res) => {
  res.json({
    mensaje: '✅ Autenticación funcionando',
    usuario: req.user?.correo || 'Usuario',
    userId: req.userId
  });
});

// Endpoint principal de chat (SIN IA)
router.post('/chat', authMiddleware, chatIA);

module.exports = router;