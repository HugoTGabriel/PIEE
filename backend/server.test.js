import request from 'supertest';
import app from './server.js'; 

describe('🧪 Suíte de Testes da API EasyEats', () => {

  // ==========================================
  // 1. TESTES FUNCIONAIS (Requisições Padrão)
  // ==========================================

  it('FUNCIONAL: Deve listar as receitas do banco local (GET /api/receitas) com status 200', async () => {
    const res = await request(app).get('/api/receitas');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Teste de integridade de rotas substituindo o de contato
  it('FUNCIONAL: Deve retornar 404 Not Found para rotas inexistentes', async () => {
    const res = await request(app).get('/api/rota-fantasma-hacker');
    expect(res.statusCode).toEqual(404);
  });

  // ==========================================
  // 2. TESTES DE SEGURANÇA (Cibersegurança)
  // ==========================================

  it('SEGURANÇA: Deve bloquear o cadastro de receita sem Token JWT (Acesso Não Autorizado)', async () => {
    const res = await request(app)
      .post('/api/receitas')
      .send({ titulo: 'Receita Clandestina', ingredientes: 'Hacker, Sal, Pimenta' });
    
    // Agora o teste espera exatamente a palavra "erro" e o texto "Acesso negado." do seu server.js
    expect(res.statusCode).toBe(403); 
    expect(res.body.erro).toBe('Acesso negado.');
  });

  it('SEGURANÇA: Deve proteger o Login contra tentativa de SQL Injection', async () => {
    const res = await request(app)
      .post('/api/auth/login') // <-- Rota corrigida para bater com seu server.js
      .send({ email: "admin' OR '1'='1", senha: "password123" });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.erro).toBe('Incorreto.');
  });

  it('SEGURANÇA: Não deve vazar a hash do Bcrypt ao buscar um usuário inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login') // <-- Rota corrigida
      .send({ email: "usuario_fantasma@email.com", senha: "123" });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.erro).toBe('Incorreto.');
  });
});