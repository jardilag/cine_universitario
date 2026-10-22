const express = require('express');
const router = express.Router();

//controlador
const mediaController = require('../controllers/mediaController');

router.get('/', mediaController.getAllMedia);

router.post('/', mediaController.insertMedia);

router.route('/:id')
  .get(mediaController.getMediaById)
  .put(mediaController.updateMedia)
  .delete(mediaController.deleteMedia);

module.exports = router;    
