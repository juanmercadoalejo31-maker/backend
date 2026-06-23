// prolog/prologService.js
// Servicio Prolog - Modo Simulado

function ejecutarProlog(consulta) {
  return new Promise((resolve) => {
    console.log('🧠 Prolog consultado:', consulta);
    const resultado = generarRespuesta(consulta);
    resolve(resultado);
  });
}

function generarRespuesta(consulta) {
  const respuestas = [];
  
  // Analizar glucosa
  if (consulta.includes('analizar_glucosa')) {
    const match = consulta.match(/analizar_glucosa\((\d+)/);
    if (match) {
      const valor = parseInt(match[1]);
      let estado = 'normal';
      if (valor < 70) estado = 'baja';
      else if (valor > 180) estado = 'alta';
      respuestas.push({ Estado: estado });
    }
  }
  
  // Recomendación de glucosa
  if (consulta.includes('recomendacion_glucosa')) {
    const match = consulta.match(/recomendacion_glucosa\((\w+)/);
    if (match) {
      const estado = match[1];
      const recs = {
        'normal': '✅ Tus niveles de glucosa están en rango normal. ¡Sigue así!',
        'baja': '⚠️ Tu glucosa está baja. Toma jugo de fruta o come algo dulce.',
        'alta': '⚠️ Tu glucosa está alta. Toma tu medicación y evita azúcares.'
      };
      respuestas.push({ Recomendacion: recs[estado] || 'Mantén control de tu glucosa.' });
    }
  }
  
  // Horario medicamentos
  if (consulta.includes('horario_medicamentos')) {
    respuestas.push({ Horario: '8:00 AM - Metformina\n8:00 PM - Metformina' });
  }
  
  // Recomendación comida
  if (consulta.includes('recomendacion_comida')) {
    respuestas.push({ Recomendacion: '🍽️ Come vegetales, proteínas magras y granos integrales. Evita azúcares.' });
  }
  
  // Recomendación ejercicio
  if (consulta.includes('recomendacion_ejercicio')) {
    respuestas.push({ Recomendacion: '🏃 Camina 30 minutos al día o haz ejercicio moderado.' });
  }
  
  // Recomendación hidratación
  if (consulta.includes('recomendacion_hidratacion')) {
    respuestas.push({ Recomendacion: '💧 Bebe 8 vasos de agua al día.' });
  }
  
  // Estado general
  if (consulta.includes('estado_general')) {
    respuestas.push({ Estado: '📊 Tu control general es bueno. Sigue así.' });
  }
  
  if (respuestas.length === 0) {
    respuestas.push({ Respuesta: 'No tengo información para esa consulta.' });
  }
  
  return respuestas;
}

module.exports = { ejecutarProlog };