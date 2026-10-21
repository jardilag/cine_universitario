const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'lista de tipos' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Ingreso de tipo' });
});

router.route('/:id')
  .get((req, res) => {
    res.json({ message: 'Consultar tipo' });
  })
  .put((req, res) => {
    res.json({ message: 'Actualización de tipo' });
  })
  .delete((req, res) => {
    res.json({ message: 'Eliminación de tipo' });
  });

module.exports = router;    