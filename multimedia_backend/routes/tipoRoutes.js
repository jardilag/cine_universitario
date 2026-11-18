const express = require('express');
const router = express.Router();

const { exigirAdmin } = require('../middleware/autorizacion');
const tipoController = require('../controllers/tipoController');

router.get('/', tipoController.getAllTipos);

router.post('/', tipoController.insertTipo);

router.route('/:id')
  .get(exigirAdmin, tipoController.getTipoById)
  .put(tipoController.updateTipo)
  .delete(tipoController.deleteTipo);

module.exports = router;
