const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const hidratacionController = require('../controllers/hidratacionController');

router.use(authMiddleware);

router.get('/', hidratacionController.getHidratacion);
router.post('/vaso', hidratacionController.addVaso);

module.exports = router;