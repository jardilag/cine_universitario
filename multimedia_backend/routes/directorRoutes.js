const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'lista de directores de cine' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Ingreso de director de cine' });
});

router.route('/:id')
  .get((req, res) => {
    res.json({ message: 'Consultar director de cine' });
  })
  .put((req, res) => {
    res.json({ message: 'Actualización de director de cine' });
  })
  .delete((req, res) => {
    res.json({ message: 'Eliminación de director de cine' });
  });

module.exports = router;    