import React, { useState } from 'react';

const Login = ({ setCurrentUser, setActiveSection }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);

    const url = isLogin
      ? 'http://localhost:3001/api/auth/login'
      : 'http://localhost:3001/api/auth/cadastro';

    const body = isLogin
      ? { email: form.email, senha: form.senha }
      : { nome: form.nome, email: form.email, senha: form.senha };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('currentUser', data.nome);
          setCurrentUser(data.nome);
          setActiveSection('home');
        } else {
          setStatus('ok');
          setIsLogin(true);
        }
      } else {
        setStatus(data.erro);
      }
    } catch {
      setStatus('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section active">
      <h2 className="section-title">{isLogin ? 'Entrar' : 'Criar Conta'}</h2>

      <div className="login-form">

        {!isLogin && (
          <div className="form-group">
            <label>Nome</label>
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" />
          </div>
        )}

        <div className="form-group">
          <label>E-mail</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Sua senha" />
        </div>

        {status === 'ok' && (
          <p style={{ color: 'green', marginBottom: '10px' }}>✅ Cadastro realizado! Faça login.</p>
        )}
        {status && status !== 'ok' && (
          <p style={{ color: 'red', marginBottom: '10px' }}>❌ {status}</p>
        )}

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
        </button>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <span
            onClick={() => { setIsLogin(!isLogin); setStatus(null); }}
            style={{ color: '#ff6b6b', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </span>
        </p>

      </div>
    </section>
  );
};

export default Login;