import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'easyeats_secret_123';

// ✅ CADASTRO
app.post('/api/auth/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.execute(
      'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );
    res.json({ mensagem: 'Cadastro realizado com sucesso!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }
    res.status(500).json({ erro: 'Erro ao cadastrar.', detalhe: err.message });
  }
});

// ✅ LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha obrigatórios.' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos.' });
    }

    const user = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, nome: user.nome });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao fazer login.', detalhe: err.message });
  }
});

// ✅ CONTATO
app.post('/api/contato', async (req, res) => {
  const { nome, email, assunto, reclame } = req.body;

  if (!nome || !email || !assunto || !reclame) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    await pool.execute(
      'INSERT INTO usuario (nome, email, assunto, reclame) VALUES (?, ?, ?, ?)',
      [nome, email, assunto, reclame]
    );
    res.json({ mensagem: 'Enviado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar.', detalhe: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});