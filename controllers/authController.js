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

    const existe = await User.findOne({ correo });

    if (existe) {
      return res.status(400).json({
        mensaje: "El usuario ya existe"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
      nombre,
      correo,
      password: passwordHash,
      edad,
      tipoDiabetes,
      metaPasos: 10000,  // Valor por defecto
      metaAgua: 8        // Valor por defecto
    });

    await nuevoUsuario.save();

    // Generar token automáticamente después del registro
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        edad: nuevoUsuario.edad,
        tipoDiabetes: nuevoUsuario.tipoDiabetes
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
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

    res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        edad: usuario.edad,
        tipoDiabetes: usuario.tipoDiabetes,
        metaPasos: usuario.metaPasos || 10000,
        metaAgua: usuario.metaAgua || 8
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al iniciar sesión"
    });
  }
};

// ======================
// OBTENER PERFIL (NUEVO)
// ======================

const getProfile = async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }
    
    res.json({
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      edad: usuario.edad,
      tipoDiabetes: usuario.tipoDiabetes,
      metaPasos: usuario.metaPasos || 10000,
      metaAgua: usuario.metaAgua || 8,
      peso: usuario.peso || null,
      altura: usuario.altura || null
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error al obtener perfil"
    });
  }
};

// ======================
// ACTUALIZAR PERFIL (NUEVO)
// ======================

const updateProfile = async (req, res) => {
  try {
    const { nombre, edad, peso, altura, tipoDiabetes, metaPasos, metaAgua } = req.body;
    
    const usuario = await User.findByIdAndUpdate(
      req.user.id,
      {
        nombre,
        edad,
        peso,
        altura,
        tipoDiabetes,
        metaPasos,
        metaAgua
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }
    
    res.json({
      mensaje: "Perfil actualizado correctamente",
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
    console.log(error);
    res.status(500).json({
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