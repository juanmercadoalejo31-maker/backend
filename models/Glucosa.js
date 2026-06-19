const mongoose = require('mongoose');

const glucosaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  valor: {
    type: Number,
    required: true,
    min: 40,
    max: 600
  },
  notas: {
    type: String,
    default: ''
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Glucosa', glucosaSchema);