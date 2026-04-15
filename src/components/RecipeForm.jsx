import React, { useState } from 'react';

const RecipeForm = ({ onRecipeAdded }) => {
  const [formData, setFormData] = useState({
    titulo: '', 
    imagem: '', 
    tempo_preparo: '', 
    dificuldade: 'Fácil', 
    ingredientes: '', 
    instrucoes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); 

    if (!token) {
      alert("Precisas de estar logado para adicionar uma receita!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/receitas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (response.ok) {
        alert("Receita salva com sucesso!");
        setFormData({ titulo: '', imagem: '', tempo_preparo: '', dificuldade: 'Fácil', ingredientes: '', instrucoes: '' });
        if (onRecipeAdded) onRecipeAdded();
      } else {
        alert(data.erro || "Erro ao salvar receita.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="recipe-form-container" style={{padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px'}}>
      <h3>👨‍🍳 Adicionar Nova Receita</h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <input 
          type="text" 
          placeholder="Título da Receita" 
          value={formData.titulo} 
          onChange={e => setFormData({...formData, titulo: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Link da Imagem" 
          value={formData.imagem} 
          onChange={e => setFormData({...formData, imagem: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="Tempo (ex: 45 min)" 
          value={formData.tempo_preparo} 
          onChange={e => setFormData({...formData, tempo_preparo: e.target.value})} 
        />
        <textarea 
          placeholder="Ingredientes (separe por vírgulas)" 
          value={formData.ingredientes} 
          onChange={e => setFormData({...formData, ingredientes: e.target.value})} 
        />
        <textarea 
          placeholder="Modo de Preparo" 
          value={formData.instrucoes} 
          onChange={e => setFormData({...formData, instrucoes: e.target.value})} 
        />
        <button type="submit" style={{padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none'}}>
          Publicar Receita
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;