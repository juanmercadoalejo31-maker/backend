const Actividad = require('../models/Actividad');

const getActividades = async (req, res) => {
  try {
    const actividades = await Actividad.find({ userId: req.user._id })
      .sort({ fecha: -1 })
      .limit(30);
    
    const hoy = new Date().toISOString().split('T')[0];
    const actividadesHoy = actividades.filter(a => 
      new Date(a.fecha).toISOString().split('T')[0] === hoy
    );
    
    const resumen = {
      pasos: actividadesHoy.reduce((sum, a) => sum + (a.pasos || 0), 0),
      minutos: actividadesHoy.reduce((sum, a) => sum + a.duracion, 0),
      calorias: actividadesHoy.reduce((sum, a) => sum + (a.calorias || 0), 0)
    };
    
    res.json({
      historial: actividades,
      resumen,
      metaPasos: req.user.metaPasos || 10000
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener actividades' });
  }
};

const createActividad = async (req, res) => {
  try {
    const { tipo, duracion } = req.body;
    
    const multiplicadorPasos = tipo === 'caminata' ? 100 : 
                               tipo === 'carrera' ? 200 :
                               tipo === 'natacion' ? 120 : 150;
    
    const pasos = duracion * multiplicadorPasos;
    const calorias = duracion * 6;
    
    const actividad = await Actividad.create({
      userId: req.user._id,
      tipo,
      duracion,
      pasos,
      calorias
    });
    
    res.status(201).json({ mensaje: 'Actividad registrada', actividad });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar actividad' });
  }
};

const deleteActividad = async (req, res) => {
  try {
    const { id } = req.params;
    await Actividad.findOneAndDelete({ _id: id, userId: req.user._id });
    res.json({ mensaje: 'Actividad eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar actividad' });
  }
};

module.exports = { getActividades, createActividad, deleteActividad };