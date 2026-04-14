import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('nome'); // 'nome' ou 'ingrediente'

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      onSearch(query, mode);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
      
      {/* Seletor de Tipo de Busca */}
      <select 
        value={mode} 
        onChange={(e) => setMode(e.target.value)} 
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }}
      >
        <option value="nome">Buscar por Nome do Prato</option>
        <option value="ingrediente">Buscar por Ingrediente</option>
      </select>

      {/* Campo de Texto */}
      <input 
        type="text" 
        placeholder={mode === 'nome' ? "Ex: Cake, Pasta, Beef..." : "Ex: Chicken, Cheese, Egg..."}
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }}
      />

      {/* Botão de Busca */}
      <button 
        type="submit" 
        style={{ padding: '10px 20px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        🔍 Buscar no Mundo
      </button>

    </form>
  );
};

export default SearchBar;