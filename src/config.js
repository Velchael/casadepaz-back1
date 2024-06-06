const { config } = require("dotenv");
config();


const DB_HOST = process.env.MYSQL_HOST;
const DB_USER = process.env.MYSQL_USER;
const DB_PASSWORD = process.env.MYSQL_PASSWORD;
const DB_DATABASE = process.env.MYSQL_DB;
const DB_PORT = process.env.MYSQL_PORTO;
const EMAIL_USER = process.env.EMAIL_USER;
const KINGHOST_SMTP_HOST = process.env.KINGHOST_SMTP_HOST;
const KINGHOST_SMTP_PORT = process.env.KINGHOST_SMTP_PORT;
const KINGHOST_SMTP_USER = process.env.KINGHOST_SMTP_USER;
const KINGHOST_SMTP_PASSWORD= process.env.KINGHOST_SMTP_PASSWORD;


module.exports = {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    DB_PORT,
    EMAIL_USER,
    KINGHOST_SMTP_HOST,
    KINGHOST_SMTP_PORT,
    KINGHOST_SMTP_USER,
    KINGHOST_SMTP_PASSWORD
  };