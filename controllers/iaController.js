// controllers/iaController.js - VERSIÓN SIN IA
const chatIA = async (req, res) => {
  try {
    const { mensaje, contexto } = req.body;

    if (!mensaje || mensaje.trim() === '') {
      return res.status(400).json({ mensaje: 'El mensaje es requerido' });
    }

    console.log('📩 Mensaje recibido:', mensaje);
    console.log('👤 Usuario:', req.user?.nombre || 'Usuario');

    // Generar respuesta predefinida según el mensaje
    const respuesta = generarRespuestaPredefinida(mensaje, contexto, req.user);

    res.json({
      respuesta,
      modo: 'predefinido'  // Indica que es una respuesta predefinida
    });

  } catch (error) {
    console.error('❌ Error en chat:', error);
    res.status(500).json({
      mensaje: 'Error al procesar la consulta',
      error: error.message
    });
  }
};

// ============================================
// GENERADOR DE RESPUESTAS PREDEFINIDAS
// ============================================

function generarRespuestaPredefinida(mensaje, contexto, usuario) {
  const msg = mensaje.toLowerCase().trim();
  const nombre = usuario?.nombre || 'Usuario';
  
  // ---- SALUDOS ----
  if (msg.includes('hola') || msg.includes('buenos días') || msg.includes('buenas') || msg.includes('saludos')) {
    return `👋 ¡Hola ${nombre}! Bienvenido a GlucoControl.

Soy tu asistente virtual. Puedo ayudarte con:

📊 **Glucosa** - Consulta tus niveles y recomendaciones
💊 **Medicamentos** - Control de tus medicinas
🍽️ **Comidas** - Consejos de alimentación
🏃 **Ejercicio** - Rutinas recomendadas
💧 **Hidratación** - Seguimiento de agua

¿En qué puedo ayudarte hoy? 😊`;
  }

  // ---- GLUCOSA ----
  if (msg.includes('glucosa') || msg.includes('azúcar') || msg.includes('azucar') || msg.includes('nivel')) {
    const glucosa = contexto?.glucosa?.[0]?.valor || 'No registrada';
    
    let estado = '';
    let consejo = '';
    
    if (glucosa !== 'No registrada') {
      if (glucosa < 70) {
        estado = '⚠️ **BAJA** - Hipoglucemia';
        consejo = 'Consume algo con azúcar rápido (jugo, galletas, glucagón).';
      } else if (glucosa > 180) {
        estado = '⚠️ **ALTA** - Hiperglucemia';
        consejo = 'Toma tu medicación, hidrátate y haz algo de ejercicio ligero.';
      } else {
        estado = '✅ **NORMAL**';
        consejo = '¡Sigue así! Mantén este rango saludable.';
      }
    }

    return `📊 **Información de Glucosa**

${glucosa !== 'No registrada' ? 
  `Nivel actual: **${glucosa} mg/dL**
Estado: ${estado}

💡 ${consejo}` : 
  'ℹ️ No tengo registros recientes de tu glucosa.'}

📌 **Rango normal:** 70-180 mg/dL
💡 **Consejo:** Mide tu glucosa regularmente y registra los valores.

¿Quieres registrar una nueva medición? Ve a la sección de Glucosa.`;
  }

  // ---- MEDICAMENTOS ----
  if (msg.includes('medicamento') || msg.includes('pastilla') || msg.includes('medicina') || msg.includes('tomar')) {
    const medicamentos = contexto?.medicamentos || [];
    const pendientes = medicamentos.filter(m => !m.tomado);
    const tomados = medicamentos.filter(m => m.tomado);

    if (medicamentos.length === 0) {
      return `💊 **No tienes medicamentos registrados**

Puedes agregar tus medicamentos en la sección correspondiente del menú principal.

📌 **Consejos:**
- Toma tus medicamentos a la misma hora todos los días
- Usa un pastillero para organizarlos
- Lleva un registro de tus tomas`;
    }

    let respuesta = `💊 **Resumen de Medicamentos**

📋 **Total:** ${medicamentos.length}
✅ **Tomados hoy:** ${tomados.length}
⏳ **Pendientes:** ${pendientes.length}

`;

    if (pendientes.length > 0) {
      respuesta += `⚠️ **Medicamentos pendientes:**\n`;
      pendientes.forEach(m => {
        respuesta += `   - ${m.nombre} (${m.dosis}) - Horario: ${m.horario}\n`;
      });
      respuesta += `\n💡 **Recuerda:** Toma tus medicamentos a tiempo para un mejor control.`;
    } else {
      respuesta += `🎉 **¡Excelente!** Todos tus medicamentos están al día.`;
    }

    return respuesta;
  }

  // ---- COMIDAS / ALIMENTACIÓN ----
  if (msg.includes('comida') || msg.includes('alimento') || msg.includes('dieta') || msg.includes('comer') || msg.includes('alimentación')) {
    return `🍽️ **Consejos de Alimentación para Diabetes**

🥗 **Prioriza:**
- Verduras sin almidón (brócoli, espinaca, lechuga)
- Proteínas magras (pollo, pescado, huevo, tofu)
- Carbohidratos complejos (arroz integral, quinoa, avena)
- Frutas con bajo índice glucémico (manzana, pera, fresas)
- Grasas saludables (aguacate, nueces, aceite de oliva)

🚫 **Limita:**
- Azúcares refinados y dulces
- Bebidas azucaradas
- Alimentos procesados
- Harinas blancas

📌 **Consejos prácticos:**
- Come a horas regulares (5-6 comidas pequeñas al día)
- Controla las porciones
- Mantén un registro de lo que comes
- Bebe agua antes y durante las comidas

¿Te gustaría sugerencias para una comida específica? 😊`;
  }

  // ---- EJERCICIO / ACTIVIDAD FÍSICA ----
  if (msg.includes('ejercicio') || msg.includes('deporte') || msg.includes('actividad') || msg.includes('caminar')) {
    const pasos = contexto?.actividad?.resumen?.pasos || 0;
    
    return `🏃 **Beneficios del Ejercicio para Diabéticos**

✅ **Mejora:** Control de glucosa, sensibilidad a la insulina
✅ **Ayuda a:** Mantener peso saludable, reducir estrés
✅ **Reduce:** Riesgo de complicaciones
✅ **Mejora:** Estado de ánimo y energía

📊 **Tu actividad hoy:** ${pasos} pasos

💡 **Recomendación diaria:**
- 30 minutos al día, 5 días a la semana
- Combina cardio y fuerza
- Camina, nada, baila o monta bicicleta

⚠️ **Importante:**
- Mide tu glucosa antes y después
- Lleva algo dulce por si baja
- Consulta a tu médico antes de empezar

💪 **¡Empieza hoy mismo!** Cada paso cuenta.`;
  }

  // ---- HIDRATACIÓN / AGUA ----
  if (msg.includes('agua') || msg.includes('hidratación') || msg.includes('beber') || msg.includes('vaso')) {
    const vasos = contexto?.hidratacion?.vasos || 0;
    const meta = contexto?.hidratacion?.metaVasos || 8;
    
    return `💧 **Hidratación**

📊 **Vasos de agua hoy:** ${vasos} de ${meta} (${Math.round((vasos/meta)*100)}%)

${vasos >= meta ? 
  '🎉 **¡Excelente!** Has alcanzado tu meta de hidratación.' : 
  `⚠️ **Te faltan ${meta - vasos} vasos** para alcanzar tu meta.`}

💡 **Beneficios de una buena hidratación:**
- Ayuda a regular la glucosa
- Mejora la función renal
- Reduce la fatiga
- Mejora la piel
- Previene la deshidratación

📌 **Consejos:**
- Lleva una botella de agua siempre contigo
- Establece recordatorios para beber
- Toma un vaso antes de cada comida
- Si haces ejercicio, bebe más agua

💧 **¡Toma un vaso de agua ahora!**`;
  }

  // ---- PESO / IMC ----
  if (msg.includes('peso') || msg.includes('imc') || msg.includes('bajar') || msg.includes('subir')) {
    const peso = usuario?.peso || 'No registrado';
    const altura = usuario?.altura || 'No registrada';
    
    let imc = 'No disponible';
    let categoria = '';
    
    if (peso !== 'No registrado' && altura !== 'No registrada') {
      imc = (peso / ((altura/100) * (altura/100))).toFixed(1);
      if (imc < 18.5) categoria = 'Bajo peso';
      else if (imc < 25) categoria = 'Normal';
      else if (imc < 30) categoria = 'Sobrepeso';
      else categoria = 'Obesidad';
    }

    return `⚖️ **Control de Peso**

📊 **Datos:**
- Peso: ${peso} kg
- Altura: ${altura} cm
- IMC: ${imc}
- Categoría: ${categoria}

💡 **Consejos para mantener un peso saludable:**
- Alimentación balanceada
- Ejercicio regular
- Buen descanso
- Manejo del estrés

🎯 **Meta recomendada:** Perder 0.5-1 kg por semana

Consulta con tu médico para un plan personalizado.`;
  }

  // ---- AYUDA / COMANDOS ----
  if (msg.includes('ayuda') || msg.includes('comandos') || msg.includes('qué puedes') || msg.includes('opciones')) {
    return `🤖 **Ayuda - GlucoAsistente**

Puedo ayudarte con estos temas:

🔹 **Glucosa** - Pregunta sobre tus niveles
   Ej: "¿Cómo está mi glucosa?"

🔹 **Medicamentos** - Control de tus medicinas
   Ej: "¿Qué medicamentos tengo pendientes?"

🔹 **Comidas** - Consejos de alimentación
   Ej: "¿Qué puedo comer?"

🔹 **Ejercicio** - Recomendaciones de actividad
   Ej: "¿Cuánto ejercicio debo hacer?"

🔹 **Hidratación** - Seguimiento de agua
   Ej: "¿Cuántos vasos de agua he tomado?"

🔹 **Peso** - Control de peso
   Ej: "¿Cómo está mi peso?"

🔹 **Consejos** - Recomendaciones generales
   Ej: "Dame consejos para la diabetes"

📌 **Siempre que tengas dudas, ¡pregúntame!** 😊`;
  }

  // ---- CONSEJOS GENERALES ----
  if (msg.includes('consejo') || msg.includes('recomendación') || msg.includes('tips') || msg.includes('sugerencia')) {
    const consejos = [
      "🩸 Controla tu glucosa regularmente (antes y después de las comidas)",
      "💊 Toma tus medicamentos a la misma hora todos los días",
      "🍽️ Come a horas regulares y controla las porciones",
      "🏃 Realiza 30 minutos de ejercicio moderado al día",
      "💧 Bebe al menos 8 vasos de agua al día",
      "😴 Duerme 7-8 horas para un buen control metabólico",
      "🧘 Maneja el estrés con meditación o respiración profunda",
      "📝 Lleva un registro de todo en la aplicación",
      "👨‍⚕️ No olvides tus citas médicas regulares",
      "🎯 Establece metas realistas y celebra tus logros"
    ];
    
    const consejoAleatorio = consejos[Math.floor(Math.random() * consejos.length)];
    return `💡 **Consejo del día:**\n\n${consejoAleatorio}\n\n¿Quieres otro consejo? Solo pregúntame. 😊`;
  }

  // ---- RESPUESTA POR DEFECTO (cuando no entiende) ----
  return `🤔 **No estoy seguro de entender tu consulta.**

Puedo ayudarte con:
📊 Glucosa
💊 Medicamentos
🍽️ Comidas
🏃 Ejercicio
💧 Hidratación
⚖️ Peso
💡 Consejos

💬 **Ejemplos de preguntas:**
- "¿Cómo está mi glucosa?"
- "¿Qué medicamentos tengo pendientes?"
- "¿Qué puedo comer para cenar?"
- "Dame consejos para la diabetes"
- "¿Cuánto ejercicio debo hacer?"

🔍 **También puedes escribir:**
- "Hola" para saludar
- "Ayuda" para ver comandos
- "Consejos" para recomendaciones

¿Qué necesitas saber? 😊`;
}

module.exports = {
  chatIA
};