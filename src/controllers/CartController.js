/**
 * Controlador de Carritos
 * Maneja las peticiones HTTP relacionadas con carritos de compra
 */

const CartService = require('../services/CartService');

class CartController {
    constructor() {
        this.cartService = new CartService();
    }

    /**
     * Crear un nuevo carrito vacío
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async createCart(req, res) {
        try {
            const newCart = await this.cartService.createCart();
            
            res.status(201).json({
                status: 'success',
                message: 'Carrito creado exitosamente',
                data: newCart
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Obtener un carrito por su ID con productos completos (populate)
     * La validación del ObjectId se hace en el middleware
     * @param {Object} req - Request object con param: cid (cart ID)
     * @param {Object} res - Response object
     */
    async getCartById(req, res) {
        try {
            const { cid } = req.params;
            const cart = await this.cartService.getCartById(cid);
            
            res.json({
                status: 'success',
                data: {
                    cartId: cart._id,
                    products: cart.products
                }
            });
        } catch (error) {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Agregar un producto al carrito
     * Si el producto ya existe, incrementa su cantidad
     * Las validaciones de ObjectId se hacen en el middleware
     * @param {Object} req - Request object con params: cid, pid
     * @param {Object} res - Response object
     */
    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await this.cartService.addProductToCart(cid, pid, 1);
            
            res.json({
                status: 'success',
                message: 'Producto agregado al carrito exitosamente',
                data: updatedCart
            });
        } catch (error) {
            const statusCode = error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado' ? 404 : 400;
            res.status(statusCode).json({
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Actualizar SOLO la cantidad de un producto en el carrito
     * Si la cantidad es 0, elimina el producto del carrito
     * Las validaciones de ObjectId y quantity se hacen en el middleware
     * @param {Object} req - Request object con params: cid, pid y body: quantity
     * @param {Object} res - Response object
     */
    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const updatedCart = await this.cartService.updateProductQuantity(cid, pid, quantity);
            
            res.json({
                status: 'success',
                message: 'Cantidad de producto actualizada exitosamente',
                data: updatedCart
            });
        } catch (error) {
            const statusCode = error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado en el carrito' ? 404 : 400;
            res.status(statusCode).json({
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Actualizar todos los productos del carrito con un arreglo nuevo
     * Las validaciones de ObjectId y array se hacen en el middleware
     * @param {Object} req - Request object con param: cid y body: products (array)
     * @param {Object} res - Response object
     */
    async updateCartProducts(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            const updatedCart = await this.cartService.updateCartProducts(cid, products);
            
            res.json({
                status: 'success',
                message: 'Carrito actualizado exitosamente',
                data: updatedCart
            });
        } catch (error) {
            const statusCode = error.message === 'Carrito no encontrado' ? 404 : 400;
            res.status(statusCode).json({
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Eliminar un producto específico del carrito
     * Las validaciones de ObjectId se hacen en el middleware
     * @param {Object} req - Request object con params: cid, pid
     * @param {Object} res - Response object
     */
    async removeProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await this.cartService.removeProductFromCart(cid, pid);
            
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito exitosamente',
                data: updatedCart
            });
        } catch (error) {
            const statusCode = error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado en el carrito' ? 404 : 400;
            res.status(statusCode).json({
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Eliminar todos los productos del carrito (vaciar carrito)
     * La validación del ObjectId se hace en el middleware
     * @param {Object} req - Request object con param: cid
     * @param {Object} res - Response object
     */
    async clearCart(req, res) {
        try {
            const { cid } = req.params;
            const clearedCart = await this.cartService.clearCart(cid);
            
            res.json({
                status: 'success',
                message: 'Carrito vaciado exitosamente',
                data: clearedCart
            });
        } catch (error) {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = CartController;