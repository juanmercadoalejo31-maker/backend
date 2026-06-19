const mongoose = require('mongoose');

const comidaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  calorias: {
    type: Number,
    default: 0
  },
  hora: {
    type: String,
    default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  registrado: {
    type: Boolean,
    default: true
  },
  fecha: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comida', comidaSchema);