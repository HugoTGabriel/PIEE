import React, { useState } from 'react';

const RecipeForm = ({ onRecipeAdded }) => {
  const [formData, setFormData] = useState({
    titulo: '', imagem: '', tempo_preparo: '', dificuldade: 'Fácil', ingredientes: '', instrucoes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/api/receitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      alert("Receita salva!");
      setFormData({ titulo: '', imagem: '', tempo_preparo: '', dificuldade: 'Fácil', ingredientes: '', instrucoes: '' });
      if (onRecipeAdded) onRecipeAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form" style={{display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: 'auto'}}>
      <h3>Nova Receita</h3>
      <input placeholder="Título" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
      <input placeholder="URL da Imagem" value={formData.imagem} onChange={e => setFormData({...formData, imagem: e.target.value})} />
      <input placeholder="Tempo (ex: 30 min)" value={formData.tempo_preparo} onChange={e => setFormData({...formData, tempo_preparo: e.target.value})} />
      <textarea placeholder="Ingredientes (separados por vírgula)" value={formData.ingredientes} onChange={e => setFormData({...formData, ingredientes: e.target.value})} />
      <textarea placeholder="Instruções" value={formData.instrucoes} onChange={e => setFormData({...formData, instrucoes: e.target.value})} />
      <button type="submit" style={{backgroundColor: '#ff6b6b', color: 'white', border: 'none', padding: '10px', borderRadius: '5px'}}>Salvar Receita</button>
    </form>
  );
};

export default RecipeForm;