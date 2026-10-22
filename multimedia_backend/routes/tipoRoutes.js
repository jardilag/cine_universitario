const express = require('express');
const router = express.Router();

//controlador
const tipoController = require('../controllers/tipoController');

router.get('/', tipoController.getAllTipos);

router.post('/', tipoController.insertTipo);

router.route('/:id')
  .get(tipoController.getTipoById)
  .put(tipoController.updateTipo)
  .delete(tipoController.deleteTipo);

module.exports = router;    