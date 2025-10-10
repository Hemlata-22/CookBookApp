import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const [recipes, setRecipes] = useState([]); //recipe list
  const [query, setQuery] = useState(''); //search query
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //load recipe from backend(all or search)
  const load = async () => {
    setLoading(true);
    try {
      if (query.trim()) {
        //search recipe by name
        const res = await api.get(`/recipe/search/${encodeURIComponent(query)}`);
        setRecipes(res.data || []);
      } else {
        //get all recipe
        const res = await api.get('/recipe');
        setRecipes(res.data || []);
      }
    } catch (e) {
      console.error(e);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);//initial load

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="container">
          <div className="hero-title">Cook with what you have</div>
          <div className="hero-subtitle">Search recipes by name and save your favorites.</div>
          <div className="home-search">
        <input
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') load(); }}
        />
        <button onClick={load}>Search</button>
          </div>
        </div>
      </div>
      {loading && <div>Loading…</div>}
      <div className="home-grid container">
        {recipes.map((r) => (
          <div key={r.id} className="card" onClick={() => navigate(`/recipe/${r.id}`)} style={{ cursor: 'pointer' }}>
            {r.thumbnail && (
              <img src={r.thumbnail} alt={r.name} />
            )}
            <h4 style={{ margin: '8px 0' }}>{r.name}</h4>
            <div className="card-meta">
              {r.postedAt && new Date(r.postedAt).toLocaleString()} {r.postedBy?.name ? `• by ${r.postedBy.name}` : ''}
            </div>
            <div className="card-actions">
              <button onClick={async () => {
              try {
                //add recipe to favorites
                let userRaw = localStorage.getItem('user');
                let user = userRaw ? JSON.parse(userRaw) : null;
                if (!user?.id) {
                  // Try to decode token if user id missing
                  const token = localStorage.getItem('token');
                  if (token) {
                    try {
                      const [, payloadB64] = token.split('.');
                      const payloadJson = JSON.parse(atob(payloadB64));
                      const userId = payloadJson?.id;
                      user = { id: userId };
                      localStorage.setItem('user', JSON.stringify(user));
                    } catch {}
                  }
                }
                if (!user?.id) return alert('Login required');
                await api.post(`/user/${user.id}/favorites/${r.id}`);
                alert('Added to favorites');
              } catch (e) {
                alert('Failed to add to favorites');
              }
            }}>Favorite</button>
              <button onClick={async (e) => {
                e.stopPropagation();
              try {
                await api.delete(`/recipe/${r.id}`);
                await load();
              } catch (e) {
                alert('Delete failed');
              }
            }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;


