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

const JWT_SECRET = process.env.JWT_SECRET || 'easyeats_secret_padrao';

//Verifica se o usuário está logado
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ erro: 'Acesso negado.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ erro: 'Sessão expirada.' });
    req.userId = decoded.id;
    next();
  });
};

// ✅ AUTH: Cadastro e Login
app.post('/api/auth/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.execute('INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]);
    res.json({ mensagem: 'Sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no cadastro.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ erro: 'Incorreto.' });
    const user = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Incorreto.' });

    const token = jwt.sign({ id: user.id, nome: user.nome }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, nome: user.nome });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login.' });
  }
});

// ✅ RECEITAS: Buscar (público) e Criar (protegido)
app.get('/api/receitas', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM receitas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar.' });
  }
});

app.post('/api/receitas', verificarToken, async (req, res) => {
  const { titulo, imagem, tempo_preparo, dificuldade, ingredientes, instrucoes } = req.body;
  try {
    await pool.execute(
      'INSERT INTO receitas (titulo, imagem, tempo_preparo, dificuldade, ingredientes, instrucoes) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, imagem, tempo_preparo, dificuldade, ingredientes, instrucoes]
    );
    res.json({ mensagem: 'Receita salva!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar.' });
  }
});

app.listen(process.env.PORT || 3001, () => console.log("Servidor ativo!"));