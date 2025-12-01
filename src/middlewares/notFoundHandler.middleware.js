/**
 * Middleware para Rutas No Encontradas (404)
 * Maneja todas las peticiones a rutas que no existen
 */

/**
 * Middleware para manejar rutas no encontradas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada',
        path: req.path,
        method: req.method
    });
};

module.exports = notFoundHandler;
