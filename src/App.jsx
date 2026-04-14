import React, { useState, useEffect } from "react";
// Importando os pedaços do site (componentes)
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RecipeCard from "./components/RecipeCard";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Contact from "./components/Contact";
import Login from "./components/Login";

// Importando o CSS para o site ficar bonito
import "./App.css";

function App() {
  // 1. ESTADOS (A nossa "Lousa de Pedidos")
  // Aqui guardamos a lista de receitas
  const [recipes, setRecipes] = useState([]);
  // Aqui guardamos quem está logado (null significa ninguém)
  const [currentUser, setCurrentUser] = useState(null);
  // Aqui controlamos qual página aparece (home, favoritos, etc)
  const [activeSection, setActiveSection] = useState("home");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  // Adicione isso junto com as outras funções (perto do handleLogout)
const handleToggleFavorite = (id) => {
  setFavorites(prev =>
    prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
  );
};

  // 2. EFEITO INICIAL (Roda assim que o site abre)
  
useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setCurrentUser(savedUser);

    // Busca as receitas do seu servidor Node
    fetch('http://localhost:3001/api/receitas')
      .then(res => res.json())
      .then(data => {
        // Mapeamos os nomes do banco para o que o seu componente espera
        const formattedRecipes = data.map(r => ({
          id: r.id,
          title: r.titulo,
          image: r.imagem,
          prepTime: r.tempo_preparo,
          difficulty: r.dificuldade,
          ingredients: r.ingredientes?.split(','), // Transforma string em lista
          instructions: r.instrucoes?.split('.')
        }));
        setRecipes(formattedRecipes);
      })
      .catch(err => console.error("Erro ao carregar receitas:", err));
  }, []);

  // 3. FUNÇÕES (A Lógica)
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setActiveSection("home");
  };
  const filteredRecipes = recipes.filter(recipe =>
  recipe.title.toLowerCase().includes(searchQuery.toLowerCase())



  
);
  // 4. O QUE APARECE NA TELA (O Desenho)
  return (
    <div className="app-container">
      {/* Garante que o CSS do 'header' se aplique ao redor da Navbar */}
      <header>
        <div className="container">
          <Navbar 
            currentUser={currentUser} 
            setActiveSection={setActiveSection} 
            onLogout={handleLogout} 
          />
        </div>
      </header>

      {activeSection === "home" && <Hero />}

      {/* 3. O 'container' do seu CSS centraliza o conteúdo */}
      <main className="container">

      {activeSection === "contact" && <Contact />}
        
      {/* SEÇÃO HOME */}
{activeSection === "home" && (
  <section className="section active">

    {!selectedRecipe && (
      <>
        <SearchBar onSearch={setSearchQuery} />
        <h2 className="section-title">Receitas Recentes</h2>
        <div className="recipes-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div key={recipe.id} onClick={() => setSelectedRecipe(recipe)} style={{cursor: 'pointer'}}>
                <RecipeCard
  recipe={recipe}
  isFavorite={favorites.includes(recipe.id)}
  onToggleFavorite={handleToggleFavorite}
/>
              </div>
            ))
          ) : (
            <p style={{textAlign: 'center', color: '#777', gridColumn: '1/-1'}}>
              Nenhuma receita encontrada para "<strong>{searchQuery}</strong>"
            </p>
          )}
        </div>
      </>
    )}

    {selectedRecipe && (
      <div className="recipe-detail active">
        <button className="back-btn" onClick={() => setSelectedRecipe(null)}>
          ← Voltar para a lista
        </button>
        <h2 className="section-title" style={{marginTop: '20px'}}>{selectedRecipe.title}</h2>
        <img 
          src={selectedRecipe.image || "https://images.unsplash.com/photo-1495195129352-aec325a55b65?auto=format&fit=crop&w=600&q=80"} 
          className="recipe-detail-img" 
          alt={selectedRecipe.title} 
        />
        <div className="recipe-info" style={{display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', margin: '20px 0'}}>
  <p><strong>🕒 Tempo:</strong> {selectedRecipe.prepTime || "N/A"}</p>
  <p><strong>📊 Dificuldade:</strong> {selectedRecipe.difficulty || "N/A"}</p>
  <button
    className={`favorite-btn ${favorites.includes(selectedRecipe.id) ? 'active' : ''}`}
    onClick={() => handleToggleFavorite(selectedRecipe.id)}
    title={favorites.includes(selectedRecipe.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    style={{fontSize: '1.5rem'}}
  >
    <i className={favorites.includes(selectedRecipe.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
  </button>
</div>
        <div className="ingredients">
          <h3>Ingredientes</h3>
          <ul>
            {selectedRecipe.ingredients?.length > 0 ? (
              selectedRecipe.ingredients.map((ing, index) => <li key={index}>{ing}</li>)
            ) : (
              <li>Nenhum ingrediente cadastrado.</li>
            )}
          </ul>
        </div>
        <div className="instructions" style={{marginTop: '20px'}}>
          <h3>Modo de Preparo</h3>
          <ol>
            {selectedRecipe.instructions?.length > 0 ? (
              selectedRecipe.instructions.map((inst, index) => <li key={index}>{inst}</li>)
            ) : (
              <li>Nenhuma instrução cadastrada.</li>
            )}
          </ol>
        </div>
      </div>
    )}

  </section>
)} 
{/* SEÇÃO FAVORITOS */}
{activeSection === "favorites" && (
  <section className="section active">
    <h2 className="section-title">Minhas Receitas Favoritas</h2>

    {favorites.length === 0 ? (
      <div className="empty-favorites">
        <p>❤️ Você ainda não favoritou nenhuma receita.</p>
        <p>Explore as receitas e clique no coração para salvar!</p>
      </div>
    ) : (
      <div className="recipes-grid">
        {recipes
          .filter(recipe => favorites.includes(recipe.id))
          .map(recipe => (
            <div key={recipe.id} onClick={() => {
              setSelectedRecipe(recipe);
              setActiveSection("home");
            }} style={{cursor: 'pointer'}}>
              <RecipeCard
                recipe={recipe}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          ))}
      </div>
    )}
  </section>
)}

        {/* SEÇÃO LOGIN */}
{activeSection === "login" && (
  <Login setCurrentUser={setCurrentUser} setActiveSection={setActiveSection} />
)}

        {/* Aqui você pode adicionar as seções de Contato ou Favoritos depois */}
        
      </main>

      <Footer />
    </div>
  );
}

export default App;
