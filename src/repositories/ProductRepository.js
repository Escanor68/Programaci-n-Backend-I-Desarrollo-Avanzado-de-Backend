/**
 * Repositorio de Productos
 * Gestiona el acceso a la base de datos para productos
 * Abstrae las operaciones de MongoDB
 */

const Product = require('../models/Product');

class ProductRepository {
    /**
     * Buscar todos los productos con filtros, ordenamiento y paginación
     * @param {Object} filter - Filtro de búsqueda de MongoDB
     * @param {Object} sort - Opciones de ordenamiento
     * @param {number} skip - Número de documentos a saltar (para paginación)
     * @param {number} limit - Número máximo de documentos a retornar
     * @returns {Array} Array de productos
     */
    async findAll(filter = {}, sort = {}, skip = 0, limit = 10) {
        return await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
    }

    /**
     * Contar documentos que coinciden con el filtro
     * @param {Object} filter - Filtro de búsqueda
     * @returns {number} Número total de documentos
     */
    async count(filter = {}) {
        return await Product.countDocuments(filter);
    }

    /**
     * Buscar un producto por su ID
     * @param {string} id - ObjectId del producto
     * @returns {Object|null} Producto encontrado o null
     */
    async findById(id) {
        return await Product.findById(id).lean();
    }

    /**
     * Buscar un producto que coincida con el filtro
     * @param {Object} filter - Filtro de búsqueda
     * @returns {Object|null} Producto encontrado o null
     */
    async findOne(filter) {
        return await Product.findOne(filter).lean();
    }

    /**
     * Crear un nuevo producto en la base de datos
     * @param {Object} productData - Datos del producto
     * @returns {Object} Producto creado
     */
    async create(productData) {
        const product = new Product(productData);
        await product.save();
        return product.toObject();
    }

    /**
     * Actualizar un producto por su ID
     * @param {string} id - ObjectId del producto
     * @param {Object} updateData - Datos a actualizar
     * @returns {Object|null} Producto actualizado o null si no existe
     */
    async updateById(id, updateData) {
        return await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } 
        ).lean();
    }

    /**
     * Eliminar un producto por su ID
     * @param {string} id - ObjectId del producto
     * @returns {Object|null} Producto eliminado o null si no existe
     */
    async deleteById(id) {
        return await Product.findByIdAndDelete(id).lean();
    }
}

module.exports = ProductRepository;