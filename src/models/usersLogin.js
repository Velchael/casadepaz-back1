const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Para generar enlaces seguros
const nodemailer = require('nodemailer');
const connection = require('./connection');
//const { EMAIL_USER, KINGHOST_SMTP_HOST, KINGHOST_SMTP_PORT, KINGHOST_SMTP_USER, KINGHOST_SMTP_PASSWORD } = require('../config.js');
//const { comparePassword } = require('../utils/passwordUtils'); // Ruta correcta a tu utilitario de comparación de contraseñas

// Función para hashear la contraseña
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const createUsers = async (users) => {
  const { username, apellido,  email, password, rol, fecha_nacimiento, telefono, direccion, nivel_liderazgo, grupo_familiar_id, estado, foto_perfil} = users;
  const query = 'INSERT INTO users(username, apellido, email, password, rol, fecha_nacimiento, telefono, direccion, nivel_liderazgo, grupo_familiar_id, estado, foto_perfil, confirmation_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const confirmationToken = crypto.randomBytes(32).toString('hex');
 // Hashear la contraseña antes de almacenarla
 const hashedPassword = await hashPassword(password);
  try {
      // Verificar si grupo_familiar_id existe
      const [grupo] = await connection.execute('SELECT id FROM grupos_familiares WHERE id = ?', [grupo_familiar_id]);
      if (grupo.length === 0) {
       throw new Error('Grupo familiar no encontrado');
       }

    const [createdUsers] = await connection.execute(query, [username, apellido, email, hashedPassword, rol, fecha_nacimiento, telefono, direccion, nivel_liderazgo, grupo_familiar_id, estado, foto_perfil, confirmationToken]);
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: '465',
      secure: true,
      auth: {
        user: 'info@intelsiteweb.com',
        pass: '11082390St.',
      }
    });

    const mailOptions = {
      from: 'info@intelsiteweb.com',
      to: email,
      subject: 'Confirmación de registro',
      text: `Clique neste link para confirmar seu cadastro: 'http://127.0.0.1:3000',/EmailConfirmation?token=${confirmationToken}`                                                 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado...: ' + info.response);

    return { message: 'Usuario registrado con éxito. Por favor, confirma tu correo electrónico' };
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    throw error;
  }
};

const comparePassword = async (inputPassword, storedPasswordHash) => {
  try {
    return await bcrypt.compare(inputPassword, storedPasswordHash);
  } catch (error) {
    console.error('Error al comparar la contraseña:', error);
    throw error;
  }
};

const getUserByUsernameAndPassword = async (username, email, password) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND email = ? AND confirmed = 1', [username, email]);

    if (rows.length === 0) {
      return null; // Usuario no encontrado o no  confirmado
    }
    const user = rows[0];
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (isPasswordValid) {

      return user; // Contraseña válida
    } else {
     // console.log('Contraseña no válida');
      return null; // Contraseña no válida
    }
  } catch (error) {
    console.error('Error al verificar el usuario:', error);
    throw error;
  }
};

const confirmUserEmail = async (confirmationToken) => {
  try {
    if (!confirmationToken) {
      throw new Error('Token de confirmación no válido');
    }
    const [user] = await connection.execute('SELECT * FROM users WHERE confirmation_token = ?', [confirmationToken]);
    
    if (!user || user.length === 0 || user[0].confirmed) {
      throw new Error('Token de confirmación no válido o ya utilizado');
    }
    const email = user[0].email;

    await connection.execute('UPDATE users SET confirmed = 1, confirmation_token = NULL WHERE email = ?', [email]);

    return { message: 'Correo electrónico confirmado con éxito' };
  } catch (error) {
    console.error('Error al confirmar el correo electrónico:', error);

    if (error.code) {
      console.error('Código de error MySQL:', error.code);
      console.error('Número de error MySQL:', error.errno);
      console.error('Mensaje de error MySQL:', error.sqlMessage);
    }

    if (error.message === 'Token de confirmación no válido') {
      error.code = 'INVALID_TOKEN';
    } else if (error.message === 'Token de confirmación no válido o ya utilizado') {
      error.code = 'USED_TOKEN';
    }
    throw error;
  }
};

module.exports = {
  createUsers,
  getUserByUsernameAndPassword,
  confirmUserEmail
};