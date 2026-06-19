const Hidratacion = require('../models/Hidratacion');

const getHidratacion = async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    let hidratacion = await Hidratacion.findOne({ userId: req.user._id, fecha: hoy });
    
    if (!hidratacion) {
      hidratacion = await Hidratacion.create({
        userId: req.user._id,
        vasos: 0,
        fecha: hoy
      });
    }
    
    res.json({
      vasos: hidratacion.vasos,
      metaVasos: req.user.metaAgua || 8
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener hidratación' });
  }
};

const addVaso = async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    let hidratacion = await Hidratacion.findOne({ userId: req.user._id, fecha: hoy });
    
    if (!hidratacion) {
      hidratacion = await Hidratacion.create({
        userId: req.user._id,
        vasos: 1,
        fecha: hoy
      });
    } else {
      hidratacion.vasos += 1;
      await hidratacion.save();
    }
    
    res.json({ mensaje: 'Vaso registrado', vasos: hidratacion.vasos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar vaso' });
  }
};

module.exports = { getHidratacion, addVaso };