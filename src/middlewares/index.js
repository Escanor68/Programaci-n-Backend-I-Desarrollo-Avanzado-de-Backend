/**
 * Exportar todos los middlewares desde un solo punto
 * Facilita la importación en otros archivos
 */

const logger = require('./logger.middleware');
const errorHandler = require('./errorHandler.middleware');
const notFoundHandler = require('./notFoundHandler.middleware');
const validators = require('./validators.middleware');
const productValidator = require('./productValidator.middleware');

module.exports = {
    logger,
    errorHandler,
    notFoundHandler,
    validators,
    productValidator
};
