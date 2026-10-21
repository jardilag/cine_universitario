const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'lista de generos' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Ingreso de genero' });
});

router.route('/:id')
  .get((req, res) => {
    res.json({ message: 'Consultar genero' });
  })
  .put((req, res) => {
    res.json({ message: 'Actualización de genero' });
  })
  .delete((req, res) => {
    res.json({ message: 'Eliminación de genero' });
  });

module.exports = router;    