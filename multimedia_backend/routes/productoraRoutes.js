const express = require('express');
const router = express.Router();

const { exigirAdmin } = require('../middleware/autorizacion');
const productoraController = require('../controllers/productoraController');

router.get('/', productoraController.getAllProductoras);

router.post('/', productoraController.insertProductora);


router.route('/:id')
  .get(exigirAdmin, productoraController.getProductoraById)
  .put(productoraController.updateProductora)
  .delete(productoraController.deleteProductora);

module.exports = router;
