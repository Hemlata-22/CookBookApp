import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import '../src/styles/Theme.css';
import '../src/styles/AppShell.css';
import '../src/styles/RecipeCreator.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Favorites from './pages/Favorites.jsx';
import RecipeCreator from './pages/RecipeCreator.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';

function App() {
  //localstorage se token fetch kr rahe hai
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return (
    <div className="app-shell">
      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
        <Link to="/favorites">Favorites</Link>
        <span className="spacer" />
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); location.href = '/login'; }}>Logout</button>
        )}
      </nav>
      {/* main content */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={token ? <Favorites /> : <Navigate to="/login" replace />} />
          <Route path="/create" element={token ? <RecipeCreator /> : <Navigate to="/login" replace />} />
          <Route path="/recipe/:id" element={token ? <RecipeDetail /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

