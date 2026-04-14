import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RecipeCard from "./components/RecipeCard";
import SearchBar from "./components/SearchBar";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  
  // Variável que guarda a receita clicada
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // 1. Carrega as receitas locais do MySQL
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setCurrentUser(savedUser);

    const carregarTudoInicalmente = async () => {
      try {
        // A. Busca do seu Banco MySQL Local
        const resLocal = await fetch('http://localhost:3001/api/receitas');
        const dataLocal = await resLocal.json();
        const locais = dataLocal.map(r => ({
          id: r.id, title: r.titulo, image: r.imagem, prepTime: r.tempo_preparo, difficulty: r.dificuldade,
          ingredients: r.ingredientes ? r.ingredientes.split(',') : [],
          instructions: r.instrucoes ? r.instrucoes.split('.') : []
        }));

        // B. Busca Receitas Populares na Nuvem (API TheMealDB)
        const resGlobal = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const dataGlobal = await resGlobal.json();
        let globais = [];
        
        if (dataGlobal.meals) {
          // Pega as 8 primeiras para misturar com as suas locais
          globais = dataGlobal.meals.slice(0, 8).map(m => {
            const ing = [];
            for (let i = 1; i <= 20; i++) {
              if (m[`strIngredient${i}`] && m[`strIngredient${i}`].trim() !== '') {
                ing.push(`${m[`strMeasure${i}`]} ${m[`strIngredient${i}`]}`);
              }
            }
            return {
              id: `api-${m.idMeal}`, title: m.strMeal, image: m.strMealThumb, prepTime: "Consultar", difficulty: "Global",
              ingredients: ing.length > 0 ? ing : ["Ingredientes não detalhados nesta busca rápida."],
              instructions: m.strInstructions ? m.strInstructions.split(/\r?\n/).filter(l => l.trim() !== '').map(l => l.replace(/^\d+[\.\)-]\s*/, '').trim()) : ["Instruções não detalhadas nesta busca rápida."],
              isGlobal: true
            };
          });
        }

        // C. Junta as Locais com as Globais na mesma tela!
        setRecipes([...locais, ...globais]);

      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      }
    };

    carregarTudoInicalmente();
  }, []);

  // 2. Salva Favoritos no navegador
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const escutarBotaoVoltar = () => {
      setSelectedRecipe(null); // Fecha a receita se o usuário apertar voltar
    };
    window.addEventListener("popstate", escutarBotaoVoltar);
    return () => window.removeEventListener("popstate", escutarBotaoVoltar);
  }, []);

  // 3. Busca Global (TheMealDB)
  const handleGlobalSearch = async (query, mode) => {
    if (!query) return;
    const url = mode === 'ingrediente' 
      ? `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`
      : `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.meals) {
        const globalRecipes = data.meals.map(m => {
          
          // Juntando os ingredientes que a API manda separados
          const ing = [];
          for (let i = 1; i <= 20; i++) {
            if (m[`strIngredient${i}`] && m[`strIngredient${i}`].trim() !== '') {
              ing.push(`${m[`strMeasure${i}`]} ${m[`strIngredient${i}`]}`);
            }
          }
          
          return {
            id: `api-${m.idMeal}`,
            title: m.strMeal,
            image: m.strMealThumb,
            prepTime: "Consultar",
            difficulty: "Global",
            // Se for busca por ingrediente, a API não manda as instruções junto, avisamos na tela:
            ingredients: ing.length > 0 ? ing : ["Ingredientes não detalhados nesta busca rápida."],
            instructions: m.strInstructions 
              ? m.strInstructions
                  .split(/\r?\n/)
                  .filter(l => l.trim() !== '') 
                  .map(l => l.replace(/^\d+[\.\)-]\s*/, '').trim()) 
              : ["Instruções não detalhadas nesta busca rápida."],
            isGlobal: true
          };
        });
        setRecipes(globalRecipes);
        // Volta para a lista caso o usuário já esteja com alguma receita aberta
        setSelectedRecipe(null); 
      } else {
        alert("Nenhuma receita encontrada no banco global para essa busca.");
      }
    } catch (err) {
      console.error("Erro API:", err);
    }
  };

  const handleToggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // 4. Nova função: Busca os detalhes completos ao clicar
  const handleRecipeClick = async (recipe) => {

    window.history.pushState({ receitaAberta: true }, "", `#receita-${recipe.id}`);
    // Se não for da API global, ou se já tiver ingredientes reais, abre a receita direto
    if (!recipe.isGlobal || (recipe.ingredients && recipe.ingredients[0] !== "Ingredientes não detalhados nesta busca rápida.")) {
      setSelectedRecipe(recipe);
      return;
    }

    // Se a receita está "incompleta", pedimos os detalhes para a API usando o ID dela
    try {
      const idReal = recipe.id.replace('api-', ''); // Tira o 'api-' que colocamos antes
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idReal}`);
      const data = await res.json();
      
      if (data.meals && data.meals[0]) {
        const m = data.meals[0];
        const ing = [];
        // Mapeia os 20 espaços de ingredientes de novo
        for (let i = 1; i <= 20; i++) {
          if (m[`strIngredient${i}`] && m[`strIngredient${i}`].trim() !== '') {
            ing.push(`${m[`strMeasure${i}`]} ${m[`strIngredient${i}`]}`);
          }
        }
        
        // Atualiza a nossa receita com os dados novos e completos
        const receitaCompleta = {
          ...recipe,
          ingredients: ing,
          instructions: m.strInstructions 
            ? m.strInstructions
                .split(/\r?\n/)
                .filter(l => l.trim() !== '')
                .map(l => l.replace(/^\d+[\.\)-]\s*/, '').trim())
            : ["Instruções não disponíveis."]
        };
        
        setSelectedRecipe(receitaCompleta); // Abre a tela com tudo preenchido!
      }
    } catch (err) {
      console.error("Erro ao buscar detalhes da receita:", err);
      setSelectedRecipe(recipe); // Se der erro na internet, abre incompleta mesmo
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="container">
          <Navbar currentUser={currentUser} setActiveSection={(sec) => {
            setActiveSection(sec);
            setSelectedRecipe(null); // Limpa a receita selecionada ao trocar de aba
          }} onLogout={() => setCurrentUser(null)} />
        </div>
      </header>
      
      {activeSection === "home" && <Hero />}
      
      <main className="container">
        
        {/* SEÇÃO HOME (Busca e Listagem) */}
        {activeSection === "home" && (
          <section className="section active">
            
            {/* TELA 1: LISTA DE RECEITAS E BARRA DE BUSCA */}
            {!selectedRecipe && (
              <>
                <SearchBar onSearch={handleGlobalSearch} />
                <h2 className="section-title">Receitas</h2>
                <div className="recipes-grid">
                  {recipes.map(recipe => (
                    <div key={recipe.id} onClick={() => handleRecipeClick(recipe)} style={{cursor: 'pointer'}}>
                      <RecipeCard 
                        recipe={recipe} 
                        isFavorite={favorites.includes(recipe.id)} 
                        onToggleFavorite={(id, e) => {
                          e.stopPropagation(); // 🛡️ Impede de abrir a receita ao favoritar
                          handleToggleFavorite(id);
                        }} 
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TELA 2: DETALHES DA RECEITA (Quando você clica nela) */}
            {selectedRecipe && (
              <div className="recipe-detail active">
                <button 
                  className="back-btn" 
                  onClick={() => window.history.back()} 
                  style={{ marginBottom: '20px', cursor: 'pointer', padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px' }}
                >
                  ← Voltar para a lista
                </button>
                <h2 className="section-title">{selectedRecipe.title}</h2>
                <img src={selectedRecipe.image} className="recipe-detail-img" alt={selectedRecipe.title} style={{ maxWidth: '100%', borderRadius: '10px' }} />
                
                <div className="recipe-info" style={{display: 'flex', gap: '20px', justifyContent: 'center', margin: '20px 0'}}>
                  <p><strong>🕒 Tempo:</strong> {selectedRecipe.prepTime}</p>
                  <p><strong>📊 Dificuldade:</strong> {selectedRecipe.difficulty}</p>
                </div>

                <div className="ingredients" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                  <h3>Ingredientes</h3>
                  <ul>
                    {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                      selectedRecipe.ingredients.map((ing, index) => <li key={index}>{ing}</li>)
                    ) : (
                      <li>Nenhum ingrediente detalhado.</li>
                    )}
                  </ul>
                </div>

                <div className="instructions" style={{ textAlign: 'left', maxWidth: '600px', margin: '20px auto' }}>
                  <h3>Modo de Preparo</h3>
                  <ol>
                    {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 ? (
                      selectedRecipe.instructions.map((inst, index) => <li key={index}>{inst}</li>)
                    ) : (
                      <li>Nenhuma instrução detalhada.</li>
                    )}
                  </ol>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ✅ SEÇÃO DE FAVORITOS (O "buraquinho" que faltava) */}
        {activeSection === "favorites" && (
          <section className="section active">
            <h2 className="section-title">Minhas Receitas Favoritas</h2>
            {favorites.length === 0 ? (
              <p style={{textAlign: 'center', marginTop: '20px'}}>Você ainda não tem receitas favoritas. ❤️</p>
            ) : (
              <div className="recipes-grid">
                {recipes.filter(r => favorites.includes(r.id)).map(recipe => (
                  <div key={recipe.id} onClick={() => {
                    handleRecipeClick(recipe);
                    setActiveSection("home"); // Volta pra home para abrir a receita
                  }} style={{cursor: 'pointer'}}>
                    <RecipeCard 
                      recipe={recipe} 
                      isFavorite={true} 
                      onToggleFavorite={(id, e) => {
                        e.stopPropagation();
                        handleToggleFavorite(id);
                      }} 
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ✅ SEÇÃO DE ADICIONAR RECEITA (O formulário fantasma) */}
        {activeSection === "add-recipe" && (
          <section className="section active">
            <RecipeForm onRecipeAdded={() => {
              setActiveSection("home");
            }} />
          </section>
        )}

        {/* SEÇÕES DE CONTATO E LOGIN */}
        {activeSection === "contact" && <Contact />}
        {activeSection === "login" && <Login setCurrentUser={setCurrentUser} setActiveSection={setActiveSection} />}
        
      </main>
      <Footer />
    </div>
  );
}

export default App;