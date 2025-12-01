/**
 * Middleware de Manejo de Errores
 * Captura y maneja todos los errores no controlados de la aplicación
 */

/**
 * Middleware global para manejo de errores
 * @param {Error} error - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    
    // En desarrollo, enviar más detalles del error
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Error interno del servidor',
        ...(isDevelopment && { stack: error.stack })
    });
};

module.exports = errorHandler;
