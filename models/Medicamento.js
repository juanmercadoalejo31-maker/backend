const mongoose = require('mongoose');

const medicamentoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El userId es requerido']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  dosis: {
    type: String,
    required: [true, 'La dosis es requerida'],
    trim: true
  },
  horario: {
    type: String,
    required: [true, 'El horario es requerido']
  },
  tomado: {
    type: Boolean,
    default: false
  },
  fechaTomado: {
    type: Date,
    default: null
  },
  fecha: {
    type: String,
    default: () => {
      const date = new Date();
      return date.toISOString().split('T')[0];
    }
  }
}, {
  timestamps: true
});

// Crear índices para mejorar el rendimiento
medicamentoSchema.index({ userId: 1, fecha: 1 });
medicamentoSchema.index({ userId: 1, tomado: 1 });

// Método para transformar la respuesta
medicamentoSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Medicamento', medicamentoSchema);