const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================
// REGISTRO
// ======================
const register = async (req, res) => {
  try {
    const {
      nombre,
      correo,
      password,
      edad,
      tipoDiabetes
    } = req.body;

    // 🔥 VALIDACIÓN BÁSICA
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    // 🔥 VER SI EXISTE USUARIO
    const existe = await User.findOne({ correo });

    if (existe) {
      return res.status(400).json({
        mensaje: "El usuario ya existe"
      });
    }

    // 🔥 ENCRIPTAR PASSWORD
    const passwordHash = await bcrypt.hash(password, 10);

    // 🔥 CREAR USUARIO
    const nuevoUsuario = new User({
      nombre,
      correo,
      password: passwordHash,
      edad,
      tipoDiabetes,
      metaPasos: 10000,
      metaAgua: 8
    });

    await nuevoUsuario.save();

    // 🔥 GENERAR TOKEN
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        edad: nuevoUsuario.edad,
        tipoDiabetes: nuevoUsuario.tipoDiabetes,
        metaPasos: nuevoUsuario.metaPasos,
        metaAgua: nuevoUsuario.metaAgua
      }
    });

  } catch (error) {
    console.log("ERROR REGISTER:", error);
    return res.status(500).json({
      mensaje: "Error al registrar usuario"
    });
  }
};

// ======================
// LOGIN
// ======================
const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Faltan datos"
      });
    }

    const usuario = await User.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        mensaje: "Usuario no encontrado"
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(400).json({
        mensaje: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        edad: usuario.edad,
        tipoDiabetes: usuario.tipoDiabetes,
        metaPasos: usuario.metaPasos,
        metaAgua: usuario.metaAgua
      }
    });

  } catch (error) {
    console.log("ERROR LOGIN:", error);
    return res.status(500).json({
      mensaje: "Error al iniciar sesión"
    });
  }
};

// ======================
// PERFIL
// ======================
const getProfile = async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).select("-password");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    return res.json(usuario);

  } catch (error) {
    console.log("ERROR PROFILE:", error);
    return res.status(500).json({
      mensaje: "Error al obtener perfil"
    });
  }
};

// ======================
// ACTUALIZAR PERFIL
// ======================
const updateProfile = async (req, res) => {
  try {
    const datos = req.body;

    const usuario = await User.findByIdAndUpdate(
      req.user.id,
      datos,
      { new: true }
    ).select("-password");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    return res.json({
      mensaje: "Perfil actualizado",
      usuario
    });

  } catch (error) {
    console.log("ERROR UPDATE:", error);
    return res.status(500).json({
      mensaje: "Error al actualizar perfil"
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};