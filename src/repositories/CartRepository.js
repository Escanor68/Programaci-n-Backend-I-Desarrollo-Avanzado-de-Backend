/**
 * Repositorio de Carritos
 * Gestiona el acceso a la base de datos para carritos
 * Abstrae las operaciones de MongoDB
 */

const Cart = require('../models/Cart');

class CartRepository {
    /**
     * Crear un nuevo carrito en la base de datos
     * @param {Object} cartData - Datos del carrito
     * @returns {Object} Carrito creado
     */
    async create(cartData) {
        const cart = new Cart(cartData);
        await cart.save();
        return cart.toObject();
    }

    /**
     * Buscar un carrito por su ID (sin populate)
     * @param {string} id - ObjectId del carrito
     * @returns {Object|null} Carrito encontrado o null
     */
    async findById(id) {
        return await Cart.findById(id).lean();
    }

    /**
     * Buscar un carrito por su ID con productos completos (populate)
     * Usa populate para obtener la información completa de los productos
     * @param {string} id - ObjectId del carrito
     * @returns {Object|null} Carrito con productos completos o null
     */
    async findByIdWithPopulate(id) {
        return await Cart.findById(id)
            .populate('products.product')
            .lean();
    }

    /**
     * Actualizar un carrito por su ID
     * @param {string} id - ObjectId del carrito
     * @param {Object} updateData - Datos a actualizar
     * @returns {Object|null} Carrito actualizado o null si no existe
     */
    async updateById(id, updateData) {
        return await Cart.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean();
    }

    /**
     * Guardar un carrito (documento Mongoose o objeto plano)
     * Maneja tanto documentos Mongoose como objetos JavaScript simples
     * @param {Object} cart - Carrito a guardar (puede ser documento Mongoose o objeto plano)
     * @returns {Object} Carrito guardado
     */
    async save(cart) {
        // Si es un documento de Mongoose, usar el método save()
        if (cart.save && typeof cart.save === 'function') {
            await cart.save();
            return cart.toObject();
        }
        // Si es un objeto plano, usar updateById
        return await this.updateById(cart._id, cart);
    }

    /**
     * Buscar un carrito por su ID para actualización
     * Retorna un documento Mongoose (no lean) para poder modificarlo
     * @param {string} id - ObjectId del carrito
     * @returns {Object|null} Documento Mongoose del carrito o null
     */
    async findByIdForUpdate(id) {
        return await Cart.findById(id);
    }
}

module.exports = CartRepository;