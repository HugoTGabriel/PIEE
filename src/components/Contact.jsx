import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', reclame: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('http://localhost:3001/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('ok');
        setForm({ nome: '', email: '', assunto: '', reclame: '' });
      } else {
        setStatus('erro');
        console.error(data.erro);
      }
    } catch {
      setStatus('erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section active">
      <h2 className="section-title">Fale Conosco</h2>

      <div className="contact-form">
        <div className="form-group">
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" />
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" />
        </div>
        <div className="form-group">
          <label>Assunto</label>
          <input name="assunto" value={form.assunto} onChange={handleChange} placeholder="Assunto da mensagem" />
        </div>
        <div className="form-group">
          <label>Mensagem</label>
          <textarea name="reclame" value={form.reclame} onChange={handleChange} placeholder="Escreva sua mensagem..." />
        </div>

        {status === 'ok' && <p style={{ color: 'green', marginBottom: '10px' }}>✅ Mensagem enviada com sucesso!</p>}
        {status === 'erro' && <p style={{ color: 'red', marginBottom: '10px' }}>❌ Erro ao enviar. Tente novamente.</p>}

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Mensagem'}
        </button>
      </div>
    </section>
  );
};

export default Contact;