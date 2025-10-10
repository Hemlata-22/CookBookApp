import React, { useState } from 'react';
import { api } from '../api/axios';
import '../styles/Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      //call backend register API
      await api.post('/auth/register', { name, email, password });
      // simple redirect to login
      location.href = '/login'; //redirect to login after success
    } catch (e) {
      setError('Register failed');
    }
  };

  return (
    <div className="auth-page">
      <h2>Register</h2>
      <form onSubmit={submit} className="auth-form">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}

export default Register;


