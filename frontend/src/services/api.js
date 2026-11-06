import axios from 'axios';

// Instancia única de Axios con la URL base de la API REST (Node/Express, puerto 3000).
// Así en el resto del código solo escribimos api.get('/generos') en vez de la URL completa.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // si el servidor no responde en 10 s, se lanza un error
});

export default api;
