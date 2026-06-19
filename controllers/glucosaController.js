const Glucosa = require('../models/Glucosa');

const getGlucosa = async (req, res) => {
  try {
    const mediciones = await Glucosa.find({ userId: req.user._id })
      .sort({ fecha: -1 })
      .limit(30);
    res.json(mediciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mediciones' });
  }
};

const createGlucosa = async (req, res) => {
  try {
    const { valor, notas } = req.body;
    
    const glucosa = await Glucosa.create({
      userId: req.user._id,
      valor,
      notas
    });
    
    res.status(201).json({ mensaje: 'Medición registrada', glucosa });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar medición' });
  }
};

const deleteGlucosa = async (req, res) => {
  try {
    const { id } = req.params;
    await Glucosa.findOneAndDelete({ _id: id, userId: req.user._id });
    res.json({ mensaje: 'Medición eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar medición' });
  }
};

module.exports = { getGlucosa, createGlucosa, deleteGlucosa };