const express = require('express');
const router = express.Router();

//controlador
const mediaController = require('../controllers/mediaController');

// El parámetro de consulta permite acceder a registros antiguos con cualquier serial.
router.route('/')
  .get((req, res) => req.query.serial === undefined
    ? mediaController.getAllMedia(req, res)
    : mediaController.getMediaById(req, res))
  .post(mediaController.insertMedia)
  .put(mediaController.updateMedia)
  .delete(mediaController.deleteMedia);

router.route('/:id')
  .get(mediaController.getMediaById)
  .put(mediaController.updateMedia)
  .delete(mediaController.deleteMedia);

module.exports = router;    
