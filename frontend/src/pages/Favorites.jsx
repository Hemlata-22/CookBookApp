import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import '../styles/Favorites.css';

function Favorites() {
  const [recipes, setRecipes] = useState([]);

  const load = async () => {
    try {
      let userRaw = localStorage.getItem('user');
      let user = userRaw ? JSON.parse(userRaw) : null;
      if (!user?.id) {
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
      if (!user?.id) return;
      const res = await api.get(`/user/${user.id}/favorites`);
      setRecipes(res.data || []);
    } catch (e) {
      console.error(e);
      setRecipes([]);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="favorites-page">
      <h2>My Favorites</h2>
      <div className="favorites-grid">
        {recipes.map((r) => (
          <div key={r.id} className="card">
            {r.thumbnail && (
              <img src={r.thumbnail} alt={r.name} />
            )}
            <h4 style={{ margin: '8px 0' }}>{r.name}</h4>
            <button onClick={async () => {
              try {
                const userRaw = localStorage.getItem('user');
                const user = userRaw ? JSON.parse(userRaw) : null;
                await api.delete(`/user/${user.id}/favorites/${r.id}`);
                await load();
              } catch (e) {
                alert('Failed to remove favorite');
              }
            }}>Unfavorite</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;


