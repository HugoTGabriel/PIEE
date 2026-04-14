const express = require('express');
const router = express.Router();
const conn = require('./conecta');

router.post('/reclame', (req, res) => {
  const { nome, email, assunto, reclame } = req.body;
  const sql = `INSERT INTO usuario (nome, email, assunto, reclame) VALUES (?, ?, ?, ?)`;

  conn.query(sql, [nome, email, assunto, reclame], (err) => {
    if (err) return res.status(500).send('Erro ao salvar: ' + err.message);
    res.send('Enviado com sucesso!');
  });
});

module.exports = router;