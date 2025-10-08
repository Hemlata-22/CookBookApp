import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { api } from '../api/axios';
import axios from 'axios';

function RecipeCreator() {
  // Recipe form state
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions from Forkify API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (name.trim() === '') {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${encodeURIComponent(name)}`);
        const data = res.data.recipes || [];
        // Map only required fields
        const mapped = data.map(r => ({
          id: r.recipe_id,
          title: r.title,
          image: r.image_url,
        }));
        setSuggestions(mapped);
      } catch (err) {
        console.error('Forkify API error:', err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [name]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/recipe', {
        name,
        instructions,
        thumbnail,
        ingredients: ingredients.split(',').map(i => i.trim()),
      });
      console.log('Recipe created:', res.data);
      // Reset form
      setName('');
      setInstructions('');
      setThumbnail('');
      setIngredients('');
      setSuggestions([]);
      alert('Recipe created successfully!');
    } catch (err) {
      console.error('Error creating recipe:', err);
      alert('Failed to create recipe.');
    }
  };

  return (
    <div className="recipe-creator-container">
      <h2>Create a New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label>Recipe Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter recipe name"
          autoComplete="off"
        />
        {/* Show Forkify suggestions */}
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map(s => (
              <li key={s.id}>{s.title}</li>
            ))}
          </ul>
        )}

        <label>Instructions</label>
        <ReactQuill
          theme="snow"
          value={instructions}
          onChange={setInstructions}
          placeholder="Enter recipe instructions"
        />

        <label>Thumbnail URL</label>
        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="Enter image URL (optional)"
        />

        <label>Ingredients (comma separated)</label>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., sugar, flour, butter"
        />

        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
}

export default RecipeCreator;
