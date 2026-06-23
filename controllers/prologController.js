// controllers/prologController.js
const { ejecutarProlog } = require('../prolog/prologService');

// ============================================
// ANALIZAR GLUCOSA
// ============================================
const analizarGlucosa = async (req, res) => {
  try {
    const { glucosa } = req.body;
    const valor = parseInt(glucosa);
    
    if (isNaN(valor) || valor < 40 || valor > 600) {
      return res.status(400).json({
        error: 'Valor inválido',
        mensaje: 'La glucosa debe estar entre 40 y 600 mg/dL'
      });
    }

    const consulta = `analizar_glucosa(${valor}, Estado).`;
    const resultados = await ejecutarProlog(consulta);
    
    let estado = 'desconocido';
    if (resultados && resultados.length > 0 && resultados[0].Estado) {
      estado = resultados[0].Estado;
    } else {
      if (valor >= 70 && valor <= 180) estado = 'normal';
      else if (valor < 70) estado = 'baja';
      else if (valor > 180) estado = 'alta';
    }
    
    const recConsulta = `recomendacion_glucosa(${estado}, Recomendacion).`;
    const recResultados = await ejecutarProlog(recConsulta);
    
    let recomendacion = '';
    if (recResultados && recResultados.length > 0 && recResultados[0].Recomendacion) {
      recomendacion = recResultados[0].Recomendacion;
    } else {
      const recs = {
        'normal': '✅ Tus niveles de glucosa están en rango normal. ¡Sigue así!',
        'baja': '⚠️ Tu glucosa está baja. Toma jugo de fruta o come algo dulce.',
        'alta': '⚠️ Tu glucosa está alta. Toma tu medicación y evita azúcares.'
      };
      recomendacion = recs[estado] || 'Mantén control de tu glucosa.';
    }

    res.json({ 
      valor, 
      estado, 
      recomendacion, 
      timestamp: new Date().toISOString() 
    });
    
  } catch (error) {
    console.error('Error en analizarGlucosa:', error);
    res.status(500).json({ 
      error: 'Error al analizar la glucosa',
      mensaje: error.message 
    });
  }
};

// ============================================
// CHAT CON PROLOG
// ============================================
const chatConProlog = async (req, res) => {
  try {
    const { mensaje } = req.body;
    
    if (!mensaje) {
      return res.status(400).json({ 
        error: 'Mensaje requerido',
        mensaje: 'Por favor, escribe un mensaje'
      });
    }

    const respuesta = await procesarMensaje(mensaje);
    res.json({ 
      respuesta, 
      timestamp: new Date().toISOString() 
    });
    
  } catch (error) {
    console.error('Error en chatConProlog:', error);
    res.status(500).json({ 
      error: 'Error al procesar el mensaje',
      mensaje: error.message 
    });
  }
};

// ============================================
// OBTENER RECOMENDACIÓN ESPECÍFICA
// ============================================
const obtenerRecomendacion = async (req, res) => {
  try {
    const { tipo } = req.body;
    
    let consulta = '';
    let respuesta = '';
    
    switch(tipo) {
      case 'comida':
        consulta = 'recomendacion_comida(Recomendacion).';
        break;
      case 'ejercicio':
        consulta = 'recomendacion_ejercicio(Recomendacion).';
        break;
      case 'hidratacion':
        consulta = 'recomendacion_hidratacion(Recomendacion).';
        break;
      case 'medicamentos':
        consulta = 'horario_medicamentos(Horario).';
        break;
      default:
        return res.status(400).json({ 
          error: 'Tipo inválido',
          mensaje: 'Tipos válidos: comida, ejercicio, hidratacion, medicamentos'
        });
    }
    
    const resultados = await ejecutarProlog(consulta);
    
    if (resultados && resultados.length > 0) {
      const key = tipo === 'medicamentos' ? 'Horario' : 'Recomendacion';
      respuesta = resultados[0][key] || 'No se encontró recomendación.';
    } else {
      const defaults = {
        'comida': '🍽️ Come vegetales, proteínas magras y granos integrales. Evita azúcares.',
        'ejercicio': '🏃 Camina 30 minutos al día o haz ejercicio moderado.',
        'hidratacion': '💧 Bebe 8 vasos de agua al día.',
        'medicamentos': '💊 8:00 AM - Metformina\n8:00 PM - Metformina'
      };
      respuesta = defaults[tipo] || 'No hay recomendación disponible.';
    }
    
    res.json({ 
      tipo, 
      recomendacion: respuesta,
      timestamp: new Date().toISOString() 
    });
    
  } catch (error) {
    console.error('Error en obtenerRecomendacion:', error);
    res.status(500).json({ 
      error: 'Error al obtener recomendación',
      mensaje: error.message 
    });
  }
};

// ============================================
// OBTENER ESTADO GENERAL
// ============================================
const obtenerEstadoGeneral = async (req, res) => {
  try {
    const consulta = 'estado_general(Estado).';
    const resultados = await ejecutarProlog(consulta);
    
    let estado = '📊 Tu control general es bueno. Sigue así.';
    if (resultados && resultados.length > 0 && resultados[0].Estado) {
      estado = resultados[0].Estado;
    }
    
    res.json({ 
      estado,
      timestamp: new Date().toISOString() 
    });
    
  } catch (error) {
    console.error('Error en obtenerEstadoGeneral:', error);
    res.status(500).json({ 
      error: 'Error al obtener estado general',
      mensaje: error.message 
    });
  }
};

// ============================================
// PROCESAR MENSAJES DEL CHAT
// ============================================
async function procesarMensaje(mensaje) {
  const msg = mensaje.toLowerCase();
  
  // GLUCOSA
  if (msg.includes('glucosa') || msg.includes('azúcar') || msg.includes('nivel')) {
    const numeros = mensaje.match(/\d+/g);
    if (numeros) {
      const valor = parseInt(numeros[0]);
      const consulta = `analizar_glucosa(${valor}, Estado).`;
      const resultados = await ejecutarProlog(consulta);
      
      let estado = 'desconocido';
      if (resultados && resultados.length > 0 && resultados[0].Estado) {
        estado = resultados[0].Estado;
      } else {
        if (valor >= 70 && valor <= 180) estado = 'normal';
        else if (valor < 70) estado = 'baja';
        else estado = 'alta';
      }
      
      const emojis = { 'normal': '✅', 'baja': '⚠️', 'alta': '⚠️' };
      const textos = {
        'normal': '¡Excelente! Tus niveles están en rango normal.',
        'baja': 'Tu glucosa está baja. Toma algo dulce inmediatamente.',
        'alta': 'Tu glucosa está alta. Toma tu medicación y evita azúcares.'
      };
      
      return `${emojis[estado] || '📊'} Glucosa: ${valor} mg/dL - ${estado.toUpperCase()}\n${textos[estado] || 'Consulta a tu médico.'}`;
    }
    return '📊 Para analizar tu glucosa, dime el valor. Ejemplo: "mi glucosa es 120"';
  }
  
  // MEDICAMENTOS
  if (msg.includes('medicamento') || msg.includes('pastilla') || msg.includes('insulina') || msg.includes('horario')) {
    const resultados = await ejecutarProlog('horario_medicamentos(Horario).');
    if (resultados && resultados.length > 0 && resultados[0].Horario) {
      return `💊 Tu horario de medicamentos:\n${resultados[0].Horario}`;
    }
    return '💊 Horario sugerido:\n🌅 8:00 AM - Metformina\n🌇 8:00 PM - Metformina';
  }
  
  // COMIDA
  if (msg.includes('comer') || msg.includes('comida') || msg.includes('alimento') || msg.includes('dieta')) {
    const resultados = await ejecutarProlog('recomendacion_comida(Recomendacion).');
    if (resultados && resultados.length > 0 && resultados[0].Recomendacion) {
      return `🍽️ ${resultados[0].Recomendacion}`;
    }
    return '🍽️ Recomendaciones:\n• Vegetales de hoja verde\n• Proteínas magras\n• Granos integrales\n• Evita azúcares refinados';
  }
  
  // EJERCICIO
  if (msg.includes('ejercicio') || msg.includes('actividad') || msg.includes('deporte') || msg.includes('caminar')) {
    const resultados = await ejecutarProlog('recomendacion_ejercicio(Recomendacion).');
    if (resultados && resultados.length > 0 && resultados[0].Recomendacion) {
      return `🏃 ${resultados[0].Recomendacion}`;
    }
    return '🏃 Recomendaciones:\n• Camina 30 min diarios\n• Ejercicio moderado 3-4 veces/semana';
  }
  
  // AGUA / HIDRATACIÓN
  if (msg.includes('agua') || msg.includes('hidratación') || msg.includes('beber')) {
    const resultados = await ejecutarProlog('recomendacion_hidratacion(Recomendacion).');
    if (resultados && resultados.length > 0 && resultados[0].Recomendacion) {
      return resultados[0].Recomendacion;
    }
    return '💧 Bebe 8-10 vasos de agua al día (2-2.5 litros)';
  }
  
  // SALUDOS
  if (msg.includes('hola') || msg.includes('buenos días') || msg.includes('buenas') || msg.includes('hey')) {
    return '👋 ¡Hola! Soy tu asistente de diabetes.\n\nPregúntame sobre:\n• 📊 Glucosa: "mi glucosa es 120"\n• 💊 Medicamentos: "horario de medicamentos"\n• 🍽️ Comida: "qué debo comer"\n• 🏃 Ejercicio: "qué ejercicio hacer"\n• 💧 Agua: "cuánta agua debo tomar"';
  }
  
  // ESTADO GENERAL
  if (msg.includes('cómo estoy') || msg.includes('mi estado') || msg.includes('resumen')) {
    const resultados = await ejecutarProlog('estado_general(Estado).');
    if (resultados && resultados.length > 0 && resultados[0].Estado) {
      return resultados[0].Estado;
    }
    return '📊 Tu control general es bueno. Sigue con tus hábitos saludables.';
  }
  
  // RESPUESTA POR DEFECTO
  return '🤔 No entendí tu pregunta.\n\nPregúntame sobre:\n• 📊 Glucosa: "mi glucosa es 120"\n• 💊 Medicamentos: "horario de medicamentos"\n• 🍽️ Comida: "qué debo comer"\n• 🏃 Ejercicio: "qué ejercicio hacer"\n• 💧 Agua: "cuánta agua debo tomar"';
}

// ============================================
// EXPORTAR
// ============================================

module.exports = {
  analizarGlucosa,
  chatConProlog,
  obtenerRecomendacion,
  obtenerEstadoGeneral
};