const express = require('express');
const router = express.Router();

// controlador
const generoController = require('../controllers/generoController');

router.get('/', generoController.getAllGeneros);

router.post('/', generoController.insertGenero);

router.route('/:id')
  .get(generoController.getGeneroById)
  .put(generoController.updateGenero)
  .delete(generoController.deleteGenero);

module.exports = router;    
