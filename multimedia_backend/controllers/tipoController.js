class TipoController {
    
  // Método para obtener todos los tipos
  getAllTipos(req, res) {
    res.json({ message: 'Lista de tipos' });
  }

  getTipoById(req, res) {
    const { id } = req.params;
    res.json({ message: `Consultar tipo con ID: ${id}` });
  }

  insertTipo(req, res) {
    res.json({ message: 'Ingreso de tipo' });
  }

  updateTipo(req, res) {
    const { id } = req.params;
    res.json({ message: `Actualización de tipo con ID: ${id}` });
  }

    deleteTipo(req, res) {
    const { id } = req.params;
    res.json({ message: `Eliminación de tipo con ID: ${id}` });
  }
}

module.exports = new TipoController();