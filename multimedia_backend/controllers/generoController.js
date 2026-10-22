class GeneroController {
    
  // Método para obtener todos los géneros
  getAllGeneros(req, res) {
    res.json({ message: 'Lista de géneros de cine' });
  }

  getGeneroById(req, res) {
    const { id } = req.params;
    res.json({ message: `Consultar género de cine con ID: ${id}` });
  }

  insertGenero(req, res) {
    res.json({ message: 'Ingreso de género de cine' });
  }

  updateGenero(req, res) {
    const { id } = req.params;
    res.json({ message: `Actualización de género de cine con ID: ${id}` });
  }

    deleteGenero(req, res) {
    const { id } = req.params;
    res.json({ message: `Eliminación de género de cine con ID: ${id}` });
  }
}

module.exports = new GeneroController();