/**
 * Middlewares de Validación
 * Validaciones comunes para parámetros de rutas
 */

const mongoose = require('mongoose');

/**
 * Validar que un parámetro sea un ObjectId válido de MongoDB
 * @param {string} paramName - Nombre del parámetro a validar (ej: 'pid', 'cid')
 * @returns {Function} Middleware de validación
 */
const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: `ID inválido en parámetro: ${paramName}`
            });
        }
        
        next();
    };
};

/**
 * Validar que múltiples parámetros sean ObjectIds válidos
 * @param {Array<string>} paramNames - Array de nombres de parámetros a validar
 * @returns {Function} Middleware de validación
 */
const validateMultipleObjectIds = (paramNames) => {
    return (req, res, next) => {
        const invalidParams = [];
        
        paramNames.forEach(paramName => {
            const id = req.params[paramName];
            if (!mongoose.Types.ObjectId.isValid(id)) {
                invalidParams.push(paramName);
            }
        });
        
        if (invalidParams.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `IDs inválidos en parámetros: ${invalidParams.join(', ')}`
            });
        }
        
        next();
    };
};

/**
 * Validar que el body contenga un campo específico
 * @param {string} fieldName - Nombre del campo requerido
 * @returns {Function} Middleware de validación
 */
const validateRequiredField = (fieldName) => {
    return (req, res, next) => {
        if (!req.body[fieldName]) {
            return res.status(400).json({
                status: 'error',
                message: `El campo '${fieldName}' es requerido`
            });
        }
        next();
    };
};

/**
 * Validar que un campo sea un array
 * @param {string} fieldName - Nombre del campo a validar
 * @returns {Function} Middleware de validación
 */
const validateArray = (fieldName) => {
    return (req, res, next) => {
        if (!Array.isArray(req.body[fieldName])) {
            return res.status(400).json({
                status: 'error',
                message: `El campo '${fieldName}' debe ser un arreglo`
            });
        }
        next();
    };
};

/**
 * Validar que un campo sea un número positivo
 * @param {string} fieldName - Nombre del campo a validar
 * @returns {Function} Middleware de validación
 */
const validatePositiveNumber = (fieldName) => {
    return (req, res, next) => {
        const value = req.body[fieldName];
        
        if (value !== undefined) {
            if (typeof value !== 'number' || value < 0) {
                return res.status(400).json({
                    status: 'error',
                    message: `El campo '${fieldName}' debe ser un número mayor o igual a 0`
                });
            }
        }
        
        next();
    };
};

module.exports = {
    validateObjectId,
    validateMultipleObjectIds,
    validateRequiredField,
    validateArray,
    validatePositiveNumber
};
