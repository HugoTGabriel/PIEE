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
    // Lista aumentada com 10 receitas para testar o Grid
    const allRecipes = [
      {
        id: 1, 
        title: "Bolo de Cenoura", 
        image: "https://cdn.pixabay.com/photo/2017/01/11/11/33/cake-1971552_1280.jpg", 
        prepTime: "45 min", 
        difficulty: "Fácil",
        ingredients: ["3 cenouras", "4 ovos", "2 xícaras de açúcar", "3 xícaras de farinha", "1 colher de fermento"],
        instructions: ["Bata a cenoura, ovos e óleo no liquidificador", "Misture com o açúcar e farinha em uma tigela", "Asse por 40 min a 180°C"]
      },
      {
        id: 2, 
        title: "Lasanha à Bolonhesa", 
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop", 
        prepTime: "60 min", 
        difficulty: "Média",
        ingredients: ["Massa de lasanha", "500g de carne moída", "Molho de tomate", "400g de queijo muçarela", "Presunto"],
        instructions: ["Faça o molho bolonhesa", "Monte as camadas de massa, molho, queijo e presunto", "Leve ao forno para gratinar"]
      },
      {
        id: 3, 
        title: "Salada Caesar Prime", 
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800&auto=format&fit=crop", 
        prepTime: "20 min", 
        difficulty: "Fácil",
        ingredients: ["Alface americana", "Croutons", "Queijo parmesão", "Peito de frango grelhado", "Molho Caesar"],
        instructions: ["Lave e corte o alface", "Grelhe o frango e corte em tiras", "Misture tudo e finalize com o molho e queijo"] 
      },
      { 
        id: 4, 
        title: "Penne ao Pesto", 
        image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800&auto=format&fit=crop", 
        prepTime: "25 min", 
        difficulty: "Fácil",
        ingredients: ["250g de Penne", "Manjericão fresco", "Azeite de oliva", "Nozes ou Pinoli", "Parmesão ralado"],
        instructions: ["Cozinhe o macarrão al dente", "Bata os ingredientes do pesto no processador", "Misture o molho na massa quente"]
      },
      { 
        id: 5, 
        title: "Frango Xadrez", 
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800&auto=format&fit=crop", 
        prepTime: "40 min", 
        difficulty: "Média",
        ingredients: ["500g de peito de frango", "1 pimentão verde", "1 cebola", "Molho shoyu", "Amendoim"],
        instructions: ["Corte o frango em cubos", "Refogue com os vegetais", "Adicione o molho e engrosse", "Finalize com amendoim"]
      },
      { 
        id: 6, 
        title: "Omelete de Ervas", 
        image: "https://images.pexels.com/photos/1435838/pexels-photo-1435838.jpeg?auto=compress&cs=tinysrgb&w=800", 
        prepTime: "10 min", 
        difficulty: "Fácil",
        ingredients: ["3 ovos", "Salsinha e cebolinha", "Sal e pimenta", "Queijo branco"],
        instructions: ["Bata os ovos levemente", "Adicione as ervas e temperos", "Frite em frigideira antiaderente dos dois lados"]
      },
      {
        id: 7, 
        title: "Torta de Limão", 
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800&auto=format&fit=crop", 
        prepTime: "50 min", 
        difficulty: "Média",
        ingredients: ["Biscuits de maisena", "Manteiga", "Leite condensado", "Suco de limão", "Raspas de limão"],
        instructions: ["Triture o biscoito e misture com manteiga para a base", "Misture o leite condensado com limão", "Coloque sobre a massa e leve à geladeira"]
      },
      {
        id: 8, 
        title: "Suco Detox", 
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop", 
        prepTime: "5 min", 
        difficulty: "Fácil",
        ingredients: ["1 folha de couve", "Suco de 1 limão", "1 maçã", "Pedaço pequeno de gengibre"],
        instructions: ["Bata tudo no liquidificador com 200ml de água", "Coe se preferir", "Sirva bem gelado"]
      },
      {
        id: 9, 
        title: "Hambúrguer Caseiro", 
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", 
        prepTime: "30 min", 
        difficulty: "Média", 
        ingredients: ["Pão", "Carne", "Queijo"], 
        instructions: ["Grelhe a carne", "Monte o lanche"]
      },
      {
        id: 10, 
        title: "Sopa de Lentilha", 
        image: "./michwich-soup-8021569.jpg", 
        prepTime: "35 min", 
        difficulty: "Fácil", 
        ingredients: ["Lentilha", "Cenoura", "Bacon"], 
        instructions: ["Cozinhe a lentilha", "Frite o bacon", "Misture tudo"]
      }
    ];
    
    console.log("Carregando " + allRecipes.length + " receitas..."); // Isso vai aparecer no F12
    setRecipes(allRecipes);
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
