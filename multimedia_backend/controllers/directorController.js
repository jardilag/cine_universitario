class DirectorController {
  // Método para obtener todos los directores
  getAllDirectors(req, res) {
    res.json({ message: 'Lista de directores de cine' });
  }

  getDirectorById(req, res) {
    const { id } = req.params;
    res.json({ message: `Consultar director de cine con ID: ${id}` });
  }

  insertDirector(req, res) {
    res.json({ message: 'Ingreso de director de cine' });
  }

  updateDirector(req, res) {
    const { id } = req.params;
    res.json({ message: `Actualización de director de cine con ID: ${id}` });
  }

    deleteDirector(req, res) {
    const { id } = req.params;
    res.json({ message: `Eliminación de director de cine con ID: ${id}` });
  }
}

module.exports = new DirectorController();