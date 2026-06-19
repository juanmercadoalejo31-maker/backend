const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile,      // 👈 Agregar
  updateProfile    // 👈 Agregar
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/auth"); // 👈 Agregar

router.post("/register", register);
router.post("/login", login);

// 👇 Agregar estas rutas protegidas
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;