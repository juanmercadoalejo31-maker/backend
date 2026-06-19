const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const comidaController = require('../controllers/comidaController');

router.use(authMiddleware);

router.get('/', comidaController.getComidas);
router.post('/', comidaController.createComida);
router.put('/:id', comidaController.updateComida);
router.delete('/:id', comidaController.deleteComida);

module.exports = router;