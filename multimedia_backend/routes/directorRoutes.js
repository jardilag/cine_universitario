const express = require('express');
const router = express.Router();

// controlador
const directorController = require('../controllers/directorController');

router.get('/', directorController.getAllDirectors);

router.post('/', directorController.insertDirector);

router.route('/:id')
  .get(directorController.getDirectorById)
  .put(directorController.updateDirector)
  .delete(directorController.deleteDirector);

module.exports = router;    