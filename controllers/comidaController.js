const Comida = require('../models/Comida');

const getComidas = async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const comidas = await Comida.find({ 
      userId: req.user._id, 
      fecha: hoy 
    }).sort({ hora: 1 });
    res.json(comidas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener comidas' });
  }
};

const createComida = async (req, res) => {
  try {
    const { nombre, descripcion, calorias } = req.body;
    
    const comida = await Comida.create({
      userId: req.user._id,
      nombre,
      descripcion,
      calorias: calorias || 0,
      registrado: true,
      fecha: new Date().toISOString().split('T')[0]
    });
    
    res.status(201).json({ mensaje: 'Comida registrada', comida });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar comida' });
  }
};

const updateComida = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, calorias, registrado } = req.body;
    
    const comida = await Comida.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { nombre, descripcion, calorias, registrado },
      { new: true }
    );
    
    res.json({ mensaje: 'Comida actualizada', comida });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar comida' });
  }
};

const deleteComida = async (req, res) => {
  try {
    const { id } = req.params;
    await Comida.findOneAndDelete({ _id: id, userId: req.user._id });
    res.json({ mensaje: 'Comida eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar comida' });
  }
};

module.exports = { getComidas, createComida, updateComida, deleteComida };