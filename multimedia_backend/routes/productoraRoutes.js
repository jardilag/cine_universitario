const express = require('express');
const router = express.Router();

//controlador
const productoraController = require('../controllers/productoraController');

router.get('/', productoraController.getAllProductoras);

router.post('/', productoraController.insertProductora);


router.route('/:id')
  .get(productoraController.getProductoraById)
  .put(productoraController.updateProductora)
  .delete(productoraController.deleteProductora);

module.exports = router;    
