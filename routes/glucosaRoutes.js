const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const glucosaController = require('../controllers/glucosaController');

router.use(authMiddleware);

router.get('/', glucosaController.getGlucosa);
router.post('/', glucosaController.createGlucosa);
router.delete('/:id', glucosaController.deleteGlucosa);

module.exports = router;