import express from 'express';
import cors from 'cors';  // Importar cors
import mqtt from 'mqtt';  // Importar mqtt

// Crear una instancia de la aplicación Express
const app = express();

// Definir el puerto en el que el servidor escuchará
const port = 4500;

// Configurar cliente MQTT
//const mqttClient = mqtt.connect('mqtt://localhost:1883');  // Conéctate a tu broker
const mqttClient = mqtt.connect('mqtt://host.docker.internal:1883');
// Verificar la conexión MQTT
mqttClient.on('connect', () => {
  console.log('Conexión exitosa con el broker MQTT');
});

mqttClient.on('error', (err) => {
  console.error('Error de conexión con el broker MQTT:', err);
});

mqttClient.on('close', () => {
  console.log('Conexión con el broker MQTT cerrada');
});

// Hacer que Express pueda manejar datos JSON en el cuerpo de las solicitudes
app.use(express.json());

// Habilitar CORS para todas las rutas
app.use(cors());  // Esto permite que cualquier origen haga solicitudes a este servidor

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta 'public'
app.use(express.static('public'));

// Ruta POST para recibir el estado del botón
app.post('/', (req, res) => {
  const { state } = req.body; // Obtener el estado recibido (Prendido o Apagado)
  
  // Validar si el estado es uno de los dos posibles valores
  if (state !== 'Prendido' && state !== 'Apagado') {
    return res.status(400).json({ error: 'Estado no válido' });
  }
  mqttClient.publish('test/topic', state, (error) => {
    if (error) {
      console.error('Error al publicar el mensaje:', error);
      return res.status(500).json({ error: 'Error al publicar mensaje MQTT' });
    }});
    console.log('Mensaje enviado al topic "test/topic": ',state);
    // Devolver una respuesta con el estado actualizado
    res.json({ message: `El estado del botón es ahora: ${state}` });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
