import React from 'react';

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite }) => {
  return (
    <div className="recipe-card">
      <img
        src={recipe.image || "https://images.unsplash.com/photo-1495195129352-aec325a55b65?auto=format&fit=crop&w=600&q=80"}
        alt={recipe.title}
        className="recipe-img"
      />

      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>

        <div className="recipe-meta">
          <span><i className="far fa-clock"></i> {recipe.prepTime}</span>
          <span><i className="fas fa-signal"></i> {recipe.difficulty}</span>
        </div>

        <div className="recipe-actions">
          <button className="btn btn-primary">Ver Receita</button>
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe.id);
            }}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <i className={isFavorite ? 'fas fa-heart' : 'far fa-heart'}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;