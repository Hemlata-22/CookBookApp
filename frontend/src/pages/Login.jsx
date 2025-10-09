import React, { useState } from 'react';
import { api } from '../api/axios';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data?.access_token;
      if (!token) throw new Error('No token');
      localStorage.setItem('token', token);
      // Decode JWT payload to extract user id and other claims
      try {
        const [, payloadB64] = token.split('.');
        const payloadJson = JSON.parse(atob(payloadB64));
        const userId = payloadJson?.id;
        localStorage.setItem('user', JSON.stringify({ id: userId, email }));
      } catch (_) {
        // Fallback to email only if decoding fails
        localStorage.setItem('user', JSON.stringify({ email }));
      }
      location.href = '/';
    } catch (e) {
      setError('Login failed');
    }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
      <form onSubmit={submit} className="auth-form">
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;


