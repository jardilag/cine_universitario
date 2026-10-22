class ProductoraController {
    
  // Método para obtener todas las productoras  
  getAllProductoras(req, res) {
    res.json({ message: 'Lista de productoras' });
  }

  getProductoraById(req, res) {
    const { id } = req.params;
    res.json({ message: `Consultar productora con ID: ${id}` });
  }

  insertProductora(req, res) {
    res.json({ message: 'Ingreso de productora' });
  }

  updateProductora(req, res) {
    const { id } = req.params;
    res.json({ message: `Actualización de productora con ID: ${id}` });
  }

    deleteProductora(req, res) {
    const { id } = req.params;
    res.json({ message: `Eliminación de productora con ID: ${id}` });
  }
}

module.exports = new ProductoraController();