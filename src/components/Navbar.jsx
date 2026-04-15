import React from 'react';

const Navbar = ({ currentUser, setActiveSection, onLogout }) => {
  return (
    <nav className="navbar">
      {/* 1. O LOGO */}
      <div 
        className="logo" 
        onClick={() => setActiveSection("home")} 
        style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}
      >
        🍴 EasyEats
      </div>

      {/* 2. OS LINKS PRINCIPAIS */}
      <ul className="nav-links">
        <li>
          <a href="#home" onClick={(e) => { e.preventDefault(); setActiveSection("home"); }}>Home</a>
        </li>
        <li>
          <a href="#favorites" onClick={(e) => { e.preventDefault(); setActiveSection("favorites"); }}>Favoritos</a>
        </li>
        <li>
          <a href="#contact" onClick={(e) => { e.preventDefault(); setActiveSection("contact"); }}>Contato</a>
        </li>
        
        {/* 3. A LÓGICA DE LOGIN */}
        {}
        {currentUser ? (
          <>
            {}
            <li>
              <a 
                href="#add-recipe" 
                onClick={(e) => { e.preventDefault(); setActiveSection("add-recipe"); }} 
                style={{ color: '#ff6b6b', fontWeight: 'bold' }}
              >
                + Nova Receita
              </a>
            </li>
            
            {/* Nome do usuário e botão de sair */}
            <li><span className="user-name">Olá, {currentUser}</span></li>
            <li><button onClick={onLogout} className="logout-btn">Sair</button></li>
          </>
        ) : (
          // O que aparece se a pessoa NÃO estiver logada
          <li>
            <button onClick={() => setActiveSection("login")} className="login-btn">
              Entrar
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;