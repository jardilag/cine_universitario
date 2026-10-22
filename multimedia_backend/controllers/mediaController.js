class MediaController {
    
  // Método para obtener toda la multimedia
  getAllMedia(req, res) {
    res.json({ message: 'Lista de multimedia completa' });
  }

  getMediaById(req, res) {
    const { id } = req.params;
    res.json({ message: `Consultar multimedia de cine con ID: ${id}` });
  }

  insertMedia(req, res) {
    res.json({ message: 'Ingreso de multimedia de cine' });
  }

  updateMedia(req, res) {
    const { id } = req.params;
    res.json({ message: `Actualización de multimedia de cine con ID: ${id}` });
  }

    deleteMedia(req, res) {
    const { id } = req.params;
    res.json({ message: `Eliminación de multimedia de cine con ID: ${id}` });
  }
}

module.exports = new MediaController();