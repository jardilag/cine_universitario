const express = require('express');
const router = express.Router();

const { exigirAdmin } = require('../middleware/autorizacion');
const generoController = require('../controllers/generoController');

router.get('/', generoController.getAllGeneros);

router.post('/', generoController.insertGenero);

router.route('/:id')
  .get(exigirAdmin, generoController.getGeneroById)
  .put(generoController.updateGenero)
  .delete(generoController.deleteGenero);

module.exports = router;
