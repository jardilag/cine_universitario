const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Rutas
const directorRoutes = require('./routes/directorRoutes');
const generoRoutes = require('./routes/generoRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const productoraRoutes = require('./routes/productoraRoutes');
const tipoRoutes = require('./routes/tipoRoutes');

// Configuración de rutas
app.use('/api/directores', directorRoutes);
app.use('/api/generos', generoRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/productoras', productoraRoutes);
app.use('/api/tipos', tipoRoutes);



app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de cine' });
});

app.listen(3000, () => {
  console.log('Servidor activo en el puerto 3000');
});
