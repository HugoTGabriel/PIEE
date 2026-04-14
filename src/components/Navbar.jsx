import React from 'react';

const Navbar = ({ currentUser, setActiveSection, onLogout }) => {
  return (
    <nav className="navbar">
      <div
        onClick={() => setActiveSection('home')}
        style={{
          fontFamily: "'Pacifico', cursive",
          fontSize: '2rem',
          background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '1px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        🍴 EasyEats
      </div>

      <ul className="nav-links">
        <li><a href="#" onClick={() => setActiveSection('home')}>Início</a></li>
        <li><a href="#" onClick={() => setActiveSection('favorites')}>Favoritos</a></li>
        <li><a href="#" onClick={() => setActiveSection('contact')}>Contato</a></li>

        {currentUser ? (
          <li className="user-info">
            <span className="user-name">Olá, {currentUser}</span>
            <button className="logout-btn" onClick={onLogout}>Sair</button>
          </li>
        ) : (
          <li><a href="#" onClick={() => setActiveSection('login')}>Entrar</a></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;







/*import React from 'react';

const Navbar = ({ currentUser, setActiveSection, onLogout }) => {
  return (
    <nav className="navbar">
      <a href="#" className="logo" onClick={() => setActiveSection('home')}>
          EasyEats
      </a>
      <ul className="nav-links">
        <li><a href="#" onClick={() => setActiveSection('home')}>Início</a></li>
        <li><a href="#" onClick={() => setActiveSection('favorites')}>Favoritos</a></li>
        <li><a href="#" onClick={() => setActiveSection('contact')}>Contato</a></li>
        
        {currentUser ? (
          <li className="user-info">
            <span className="user-name">Olá, {currentUser}</span>
            <button className="logout-btn" onClick={onLogout}>Sair</button>
          </li>
        ) : (
          <li><a href="#" onClick={() => setActiveSection('login')}>Entrar</a></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;*/