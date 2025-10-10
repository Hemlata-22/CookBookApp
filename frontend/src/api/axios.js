import axios from 'axios';

// Axios instance create kar rahe hain jo backend API ke saath communicate karega
export const api = axios.create({
  baseURL: 'http://localhost:3000', // URL of NestJS backend
  headers: {
    'Content-Type': 'application/json',// JSON format me data bhejna aur receive karna
  },
});

// Request interceptor: har request ke saath Authorization token attach karenge agar available ho
api.interceptors.request.use((config) => {
  // Browser me localStorage se token fetch kar rahe hain
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers = config.headers || {}; // Ensure headers exist
    config.headers['Authorization'] = `Bearer ${token}`;// Bearer token set karna
  }
  //modified config return krna zaroori hai
  return config;
});