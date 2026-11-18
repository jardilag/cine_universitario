const express = require('express');
const router = express.Router();

const { exigirAdmin } = require('../middleware/autorizacion');
const directorController = require('../controllers/directorController');

router.get('/', directorController.getAllDirectors);

router.post('/', directorController.insertDirector);

router.route('/:id')
  .get(exigirAdmin, directorController.getDirectorById)
  .put(directorController.updateDirector)
  .delete(directorController.deleteDirector);

module.exports = router;
