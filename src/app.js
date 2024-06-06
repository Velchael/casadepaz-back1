const express = require('express');
const cors = require('cors');
const router = require('./router');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const app = express();


const corsOptions = {
//1 origin: 'https://casadepaz.intelsiteweb.com',
 //2 origin: 'https://velchael.github.io/Paz/',

 // origin: 'https://casadepazdos.netlify.app/',
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de las cabeceras CORS para todas las solicitudes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Asegúrate de que esto coincida con el origen permitido
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

 //Configura los encabezados CORS adecuados
app.options('/users/confirm/:token', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Luego, agrega el manejador de la ruta POST
app.post('/users/confirm/:token', (req, res) => {
  // Tu lÃ³gica de confirmaciÃ³n de correo electrÃ³nico aquÃ­
});

app.use(router);
// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!!!!!!!', details: err.message });
});

module.exports = app;

