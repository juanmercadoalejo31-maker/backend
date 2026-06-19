const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ mensaje: 'No autorizado - Token no proporcionado' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado - userId:', decoded.id);
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ mensaje: 'No autorizado - Usuario no encontrado' });
    }
    
    req.user = user;
    req.user.id = user._id;  // Asegurar que id esté disponible
    console.log('Usuario autenticado:', user.correo);
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ mensaje: 'No autorizado - Token inválido' });
  }
};

module.exports = authMiddleware;