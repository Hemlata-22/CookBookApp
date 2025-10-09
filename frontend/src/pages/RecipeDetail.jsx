import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/axios';
import '../styles/RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/recipe/${id}`);
        setRecipe(res.data);
      } catch (e) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="recipe-detail container">Loading…</div>;
  if (error) return <div className="recipe-detail container">{error}</div>;
  if (!recipe) return <div className="recipe-detail container">Not found</div>;

  const postedAt = recipe.postedAt ? new Date(recipe.postedAt).toLocaleString() : '';
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  return (
    <div className="recipe-detail container">
      <div className="detail-header">
        <h2>{recipe.name}</h2>
        <div className="meta">{postedAt} {recipe.postedBy?.name ? `• by ${recipe.postedBy.name}` : ''}</div>
        <div className="detail-actions">
          <Link to="/">Back to Home</Link>
        </div>
      </div>

      {recipe.thumbnail && (
        <img className="detail-thumb" src={recipe.thumbnail} alt={recipe.name} />
      )}

      <div className="detail-grid">
        <section className="ingredients">
          <h3>Ingredients</h3>
          {ingredients.length ? (
            <ul>
              {ingredients.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          ) : (
            <div>No ingredients listed.</div>
          )}
        </section>

        <section className="instructions">
          <h3>Instructions</h3>
          <div
            className="ql-view"
            dangerouslySetInnerHTML={{ __html: recipe.instructions || '' }}
          />
        </section>
      </div>
    </div>
  );
}

export default RecipeDetail;


