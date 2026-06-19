const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const medicamentoController = require('../controllers/medicamentoController');

router.use(authMiddleware);

router.get('/', medicamentoController.getMedicamentos);
router.post('/', medicamentoController.createMedicamento);
router.put('/:id', medicamentoController.updateMedicamento);
router.delete('/:id', medicamentoController.deleteMedicamento);

module.exports = router;