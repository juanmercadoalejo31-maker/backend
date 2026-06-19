const mongoose = require('mongoose');

const hidratacionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vasos: {
    type: Number,
    default: 0
  },
  fecha: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  timestamps: true
});

// Índice compuesto único para evitar duplicados por día
hidratacionSchema.index({ userId: 1, fecha: 1 }, { unique: true });

module.exports = mongoose.model('Hidratacion', hidratacionSchema);