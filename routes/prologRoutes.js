const express = require("express");

const router = express.Router();

const {
  analizarGlucosa
} = require("../controllers/prologController");

router.post(
  "/analizar",
  analizarGlucosa
);

module.exports = router;