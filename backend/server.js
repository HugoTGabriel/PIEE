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

// Pega a chave do .env ou usa uma padrão 
const JWT_SECRET = process.env.JWT_SECRET || 'EuNãoAguentoMaisEssePFC8520';

// Verifica se o usuário está logado antes de permitir certas ações
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Pega o token do cabeçalho "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ erro: 'Sessão expirada ou token inválido.' });
    }
    req.userId = decoded.id; // Salva o ID do usuário para uso posterior se precisar
    next(); // Permite que a requisição continue para a rota
  });
};

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
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
    }
    //Erro genérico para o usuário
    res.status(500).json({ erro: 'Ocorreu um erro interno ao processar seu cadastro.' });
  }
});

// ✅ LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const user = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, nome: user.nome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao tentar realizar o login.' }); // Erro genérico para o usuário
  }
});

// ✅ BUSCAR RECEITAS (Pública)
app.get('/api/receitas', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM receitas');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Não foi possível carregar as receitas.' });
  }
});

// ✅ ADICIONAR RECEITA
// Incluímos o 'verificarToken'
app.post('/api/receitas', verificarToken, async (req, res) => {
  const { titulo, imagem, tempo_preparo, dificuldade, ingredientes, instrucoes } = req.body;
  try {
    await pool.execute(
      'INSERT INTO receitas (titulo, imagem, tempo_preparo, difficulty, ingredients, instructions) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, imagem, tempo_preparo, dificuldade, ingredientes, instrucoes]
    );
    res.json({ mensagem: 'Receita cadastrada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar a nova receita.' }); //Erro genérico para o usuário
  }
});

// ✅ CONTATO
app.post('/api/contato', async (req, res) => {
  const { nome, email, assunto, reclame } = req.body;

  try {
    await pool.execute(
      'INSERT INTO usuario (nome, email, assunto, reclame) VALUES (?, ?, ?, ?)',
      [nome, email, assunto, reclame]
    );
    res.json({ mensagem: 'Sua mensagem foi enviada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao processar sua mensagem de contato.' }); //Erro genérico para o usuário
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3001}`);
});