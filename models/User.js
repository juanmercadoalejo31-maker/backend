const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  edad: {
    type: Number,
    default: null
  },
  tipoDiabetes: {
    type: String,
    default: 'tipo2'
  },
  // 👇 Agrega estos campos que usa el Dashboard
  metaPasos: {
    type: Number,
    default: 10000
  },
  metaAgua: {
    type: Number,
    default: 8
  },
  peso: {
    type: Number,
    default: null
  },
  altura: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);