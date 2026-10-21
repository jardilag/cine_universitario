const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'lista de multimedia' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Ingreso de multimedia' });
});

router.route('/:id')
  .get((req, res) => {
    res.json({ message: 'Consultar multimedia' });
  })
  .put((req, res) => {
    res.json({ message: 'Actualización de multimedia' });
  })
  .delete((req, res) => {
    res.json({ message: 'Eliminación de multimedia' });
  });

module.exports = router;    