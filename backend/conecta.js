const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pi'
});

conn.connect((err) => {
  if (err) {
    console.error('Falha na conexão: ' + err.message);
    return;
  }
  console.log('Conectado no banco de dados com sucesso!');
});

module.exports = conn;