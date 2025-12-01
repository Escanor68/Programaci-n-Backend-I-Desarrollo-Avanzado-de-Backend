/**
 * Middleware de Logging
 * Registra todas las peticiones HTTP que llegan al servidor
 */

/**
 * Middleware para registrar peticiones HTTP
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path}`);
    next();
};

module.exports = logger;
