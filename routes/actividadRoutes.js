const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const actividadController = require('../controllers/actividadController');

router.use(authMiddleware);

router.get('/', actividadController.getActividades);
router.post('/', actividadController.createActividad);
router.delete('/:id', actividadController.deleteActividad);

module.exports = router;