import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { api } from "../api/axios";
import "../styles/RecipeCreator.css";

function RecipeCreator() {
  // Recipe form state
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Debounce name input for external suggestions
  const debounceTimerRef = useRef(null);
  const debouncedName = useMemo(() => name.trim(), [name]);

  // Fetch suggestions from Forkify API
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If input is empty, clear suggestions immediately
    if (debouncedName === "") {
      setSuggestions([]);
      return;
    }

    // Debounce external API request
    debounceTimerRef.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        // Forkify v2 API endpoint
        const res = await axios.get(
          `https://forkify-api.herokuapp.com/api/v2/recipes?search=${encodeURIComponent(
            debouncedName
          )}`
        );
        const data = res?.data?.data?.recipes || [];
        const mapped = data.map((r) => ({
          id: r.id,
          title: r.title,
          image: r.image_url,
        }));
        setSuggestions(mapped);
      } catch (err) {
        console.error("Forkify API error:", err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 400);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [debouncedName]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic validation
    if (!name.trim()) {
      setErrorMessage("Recipe name is required.");
      return;
    }
    if (!instructions || instructions.replace(/<(.|\n)*?>/g, "").trim() === "") {
      setErrorMessage("Instructions are required.");
      return;
    }

    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      const userId = user?.id;
      //send create request to backend
      const res = await api.post("/recipe", {
        userId,
        name,
        instructions,
        thumbnail,
        ingredients: ingredients.split(",").map((i) => i.trim()),
      });
      console.log("Recipe created:", res.data);
      // Reset form
      setName("");
      setInstructions("");
      setThumbnail("");
      setIngredients("");
      setSuggestions([]);
      alert("Recipe created successfully!");
    } catch (err) {
      console.error("Error creating recipe:", err);
      alert("Failed to create recipe.");
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
        {(isLoadingSuggestions || suggestions.length > 0) && (
          <div className="suggestions-wrapper">
            {isLoadingSuggestions && (
              <div className="suggestions-loading">Searching…</div>
            )}
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => {
                      setName(s.title);
                      setSuggestions([]);
                    }}
                  >
                    {s.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
        {thumbnail?.trim() && (
          <div className="thumbnail-preview">
            <img
              src={thumbnail}
              alt="Recipe thumbnail preview"
              onError={(e) => {
                // Hide broken image
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <label>Ingredients (comma separated)</label>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., sugar, flour, butter"
        />

        {errorMessage && <div className="form-error">{errorMessage}</div>}
        <button
          type="submit"
          disabled={!name.trim() || !instructions || instructions.replace(/<(.|\n)*?>/g, "").trim() === ""}
          className={!name.trim() || !instructions || instructions.replace(/<(.|\n)*?>/g, "").trim() === "" ? "btn disabled" : "btn"}
        >
          Create Recipe
        </button>
      </form>
    </div>
  );
}

export default RecipeCreator;
