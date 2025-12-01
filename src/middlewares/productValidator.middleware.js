/**
 * Middleware de Validación de Productos
 * Valida los datos de entrada para crear/actualizar productos
 */

/**
 * Validar datos de producto al crear
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const validateProductCreate = (req, res, next) => {
    const { title, description, code, price, stock, category } = req.body;
    const errors = [];

    // Validar campos requeridos
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push('El campo "title" es requerido y debe ser un string no vacío');
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.push('El campo "description" es requerido y debe ser un string no vacío');
    }

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
        errors.push('El campo "code" es requerido y debe ser un string no vacío');
    }

    if (price === undefined || typeof price !== 'number' || price < 0) {
        errors.push('El campo "price" es requerido y debe ser un número mayor o igual a 0');
    }

    if (stock === undefined || typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
        errors.push('El campo "stock" es requerido y debe ser un número entero mayor o igual a 0');
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
        errors.push('El campo "category" es requerido y debe ser un string no vacío');
    }

    // Validar thumbnails si existe
    if (req.body.thumbnails !== undefined) {
        if (!Array.isArray(req.body.thumbnails)) {
            errors.push('El campo "thumbnails" debe ser un arreglo');
        } else {
            const invalidThumbnails = req.body.thumbnails.filter(
                thumb => typeof thumb !== 'string'
            );
            if (invalidThumbnails.length > 0) {
                errors.push('Todos los elementos de "thumbnails" deben ser strings');
            }
        }
    }

    // Validar status si existe
    if (req.body.status !== undefined && typeof req.body.status !== 'boolean') {
        errors.push('El campo "status" debe ser un booleano');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Errores de validación',
            errors: errors
        });
    }

    next();
};

/**
 * Validar datos de producto al actualizar
 * Permite actualizar solo algunos campos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const validateProductUpdate = (req, res, next) => {
    const errors = [];
    const { title, description, code, price, stock, category, status, thumbnails } = req.body;

    // Validar tipos de datos si los campos están presentes
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
        errors.push('El campo "title" debe ser un string no vacío');
    }

    if (description !== undefined && (typeof description !== 'string' || description.trim().length === 0)) {
        errors.push('El campo "description" debe ser un string no vacío');
    }

    if (code !== undefined && (typeof code !== 'string' || code.trim().length === 0)) {
        errors.push('El campo "code" debe ser un string no vacío');
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        errors.push('El campo "price" debe ser un número mayor o igual a 0');
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) {
        errors.push('El campo "stock" debe ser un número entero mayor o igual a 0');
    }

    if (category !== undefined && (typeof category !== 'string' || category.trim().length === 0)) {
        errors.push('El campo "category" debe ser un string no vacío');
    }

    if (status !== undefined && typeof status !== 'boolean') {
        errors.push('El campo "status" debe ser un booleano');
    }

    if (thumbnails !== undefined) {
        if (!Array.isArray(thumbnails)) {
            errors.push('El campo "thumbnails" debe ser un arreglo');
        } else {
            const invalidThumbnails = thumbnails.filter(thumb => typeof thumb !== 'string');
            if (invalidThumbnails.length > 0) {
                errors.push('Todos los elementos de "thumbnails" deben ser strings');
            }
        }
    }

    // Verificar que al menos un campo se esté actualizando
    if (Object.keys(req.body).length === 0) {
        errors.push('Debe proporcionar al menos un campo para actualizar');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Errores de validación',
            errors: errors
        });
    }

    next();
};

module.exports = {
    validateProductCreate,
    validateProductUpdate
};
