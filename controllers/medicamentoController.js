const Medicamento = require('../models/Medicamento');

const getMedicamentos = async (req, res) => {
  try {
    console.log('=== getMedicamentos ===');
    console.log('Usuario ID:', req.user?._id);
    
    const hoy = new Date().toISOString().split('T')[0];
    console.log('Fecha hoy:', hoy);
    
    const medicamentos = await Medicamento.find({ 
      userId: req.user._id, 
      fecha: hoy 
    }).sort({ horario: 1 });
    
    console.log('Medicamentos encontrados:', medicamentos.length);
    res.json(medicamentos);
  } catch (error) {
    console.error('Error en getMedicamentos:', error);
    res.status(500).json({ mensaje: 'Error al obtener medicamentos', error: error.message });
  }
};

const createMedicamento = async (req, res) => {
  try {
    console.log('=== createMedicamento ===');
    console.log('Body recibido:', req.body);
    console.log('Usuario ID:', req.user?._id);
    console.log('Usuario email:', req.user?.email);
    
    const { nombre, dosis, horario } = req.body;
    
    // Validaciones
    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre es requerido' });
    }
    if (!dosis) {
      return res.status(400).json({ mensaje: 'La dosis es requerida' });
    }
    if (!horario) {
      return res.status(400).json({ mensaje: 'El horario es requerido' });
    }
    
    const fechaActual = new Date().toISOString().split('T')[0];
    console.log('Fecha actual:', fechaActual);
    
    const medicamentoData = {
      userId: req.user._id,
      nombre,
      dosis,
      horario,
      tomado: false,
      fecha: fechaActual
    };
    
    console.log('Datos a guardar:', medicamentoData);
    
    const medicamento = await Medicamento.create(medicamentoData);
    
    console.log('Medicamento guardado exitosamente:', medicamento._id);
    console.log('Medicamento:', medicamento);
    
    res.status(201).json({ 
      mensaje: 'Medicamento agregado', 
      medicamento: {
        _id: medicamento._id,
        nombre: medicamento.nombre,
        dosis: medicamento.dosis,
        horario: medicamento.horario,
        tomado: medicamento.tomado
      }
    });
  } catch (error) {
    console.error('=== ERROR EN createMedicamento ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ mensaje: 'Error al agregar medicamento', error: error.message });
  }
};

const updateMedicamento = async (req, res) => {
  try {
    console.log('=== updateMedicamento ===');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    
    const { id } = req.params;
    const { nombre, dosis, horario, tomado } = req.body;
    
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (dosis) updateData.dosis = dosis;
    if (horario) updateData.horario = horario;
    if (tomado !== undefined) {
      updateData.tomado = tomado;
      if (tomado) updateData.fechaTomado = new Date();
    }
    
    console.log('Update data:', updateData);
    
    const medicamento = await Medicamento.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateData,
      { new: true }
    );
    
    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }
    
    console.log('Medicamento actualizado:', medicamento._id);
    res.json({ mensaje: 'Medicamento actualizado', medicamento });
  } catch (error) {
    console.error('Error en updateMedicamento:', error);
    res.status(500).json({ mensaje: 'Error al actualizar medicamento', error: error.message });
  }
};

const deleteMedicamento = async (req, res) => {
  try {
    console.log('=== deleteMedicamento ===');
    console.log('ID:', req.params.id);
    
    const { id } = req.params;
    const result = await Medicamento.findOneAndDelete({ _id: id, userId: req.user._id });
    
    if (!result) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }
    
    console.log('Medicamento eliminado:', result._id);
    res.json({ mensaje: 'Medicamento eliminado' });
  } catch (error) {
    console.error('Error en deleteMedicamento:', error);
    res.status(500).json({ mensaje: 'Error al eliminar medicamento', error: error.message });
  }
};

module.exports = { getMedicamentos, createMedicamento, updateMedicamento, deleteMedicamento };