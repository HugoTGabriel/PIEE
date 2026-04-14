const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EasyEats</h3>
            <ul>
              <li><a href="#">Sobre nós</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Receitas</h3>
            <ul>
              <li><a href="#">Mais populares</a></li>
              <li><a href="#">Recentes</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contato</h3>
            <ul>
              <li><a href="#">contato@easyeats.com</a></li>
            </ul>
          </div>
        </div>
        <p className="copyright">© 2026 EasyEats - Seu Livro de Receitas Digital</p>
      </div>
    </footer>
  );
};

export default Footer;