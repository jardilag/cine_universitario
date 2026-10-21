const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'lista de productoras' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Ingreso de productora' });
});

router.route('/:id')
  .get((req, res) => {
    res.json({ message: 'Consultar productora' });
  })
  .put((req, res) => {
    res.json({ message: 'Actualización de productora' });
  })
  .delete((req, res) => {
    res.json({ message: 'Eliminación de productora' });
  });

module.exports = router;    