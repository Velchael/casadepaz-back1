const usersLogin = require('../models/usersLogin');
const jwt = require('jsonwebtoken');

const createUsers = async (req, res) => {
  try {
    const result = await usersLogin.createUsers(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'El correo electrónico ya está registrado') {
      res.status(409).json({ message: error.message });
    } else if (error.message === 'Grupo familiar no encontrado') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error interno del servidor...' });
    }
  }
};


const getUserByUsernameAndPassword = async (req, res) => {
  const { username, email, password} = req.body;
  console.log('Solicitud de inicio de sesión recibida:', req.body);
  try {
    const user = await usersLogin.getUserByUsernameAndPassword(username, email, password);
    if (user) {
         // Crear el token JWT
      const token = jwt.sign(
        { username: user.username, email: user.email },
        process.env.JWT_SECRET, // Llave secreta para firmar el token
        { expiresIn: '30m' } // Token válido por 1 hora
      );
      return res.status(200).json({ token });
    
    } else {
      return res.status(404).json({ message: 'Usuario não encontrado ou email não confirmado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro do Servidor Interno..' });
  }
};

const confirmUserEmail = async (req, res) => {
  try {
    const token = req.body.token;
   if (!token) {
     return res.status(400).json({ message: 'Token de confirmación no proporcionado' });
   }
    const result = await usersLogin.confirmUserEmail(token);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al confirmar el correo electrónico:', error);

    if (error.code === 'INVALID_TOKEN') {
      return res.status(404).json({ message: 'El token de confirmación no es válido' });
    } else if (error.code === 'USED_TOKEN') {
      return res.status(404).json({ message: 'El token de confirmación ya ha sido utilizado' });
    } else if (error.code === 'TOKEN_EXPIRED') {
      return res.status(400).json({ message: 'El token de confirmación ha expirado' });
    }
    res.status(500).json({ message: 'Error al confirmar el correo electrónico.' });
  }
};

module.exports = {
  createUsers,
  getUserByUsernameAndPassword,
  confirmUserEmail
};