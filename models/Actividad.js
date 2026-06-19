const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipo: {
    type: String,
    enum: ['caminata', 'carrera', 'natacion', 'ciclismo', 'gimnasio'],
    required: true
  },
  duracion: {
    type: Number,
    required: true
  },
  pasos: {
    type: Number,
    default: 0
  },
  calorias: {
    type: Number,
    default: 0
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Actividad', actividadSchema);