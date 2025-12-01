/**
 * Servicio de Carritos
 * Contiene la lógica de negocio para carritos de compra
 */

const CartRepository = require('../repositories/CartRepository');
const ProductRepository = require('../repositories/ProductRepository');

class CartService {
    constructor() {
        this.cartRepository = new CartRepository();
        this.productRepository = new ProductRepository();
    }

    /**
     * Crear un nuevo carrito vacío
     * @returns {Object} Carrito creado
     */
    async createCart() {
        const newCart = await this.cartRepository.create({
            products: []
        });
        return newCart;
    }

    /**
     * Obtener un carrito por su ID con productos completos (populate)
     * @param {string} id - ID del carrito (ObjectId de MongoDB)
     * @returns {Object} Carrito con productos completos
     * @throws {Error} Si el carrito no existe
     */
    async getCartById(id) {
        const cart = await this.cartRepository.findByIdWithPopulate(id);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    /**
     * Agregar un producto al carrito
     * Si el producto ya existe, incrementa su cantidad
     * @param {string} cartId - ID del carrito
     * @param {string} productId - ID del producto
     * @param {number} quantity - Cantidad a agregar (default: 1)
     * @returns {Object} Carrito actualizado con productos completos
     * @throws {Error} Si el carrito o producto no existen
     */
    async addProductToCart(cartId, productId, quantity = 1) {
        // Verificar que el producto existe antes de agregarlo
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        // Obtener el carrito como documento Mongoose para poder modificarlo
        const cart = await this.cartRepository.findByIdForUpdate(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        // Buscar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(
            item => item.product.toString() === productId.toString()
        );

        if (existingProductIndex !== -1) {
            // Si el producto ya existe, incrementar la cantidad
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Si el producto no existe, agregarlo al carrito
            cart.products.push({
                product: productId,
                quantity: quantity
            });
        }

        await this.cartRepository.save(cart);
        return await this.getCartById(cartId);
    }

    /**
     * Eliminar un producto del carrito
     * @param {string} cartId - ID del carrito
     * @param {string} productId - ID del producto a eliminar
     * @returns {Object} Carrito actualizado
     * @throws {Error} Si el carrito o producto no existen
     */
    async removeProductFromCart(cartId, productId) {
        const cart = await this.cartRepository.findByIdForUpdate(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === productId.toString()
        );

        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        cart.products.splice(productIndex, 1);
        await this.cartRepository.save(cart);
        return await this.getCartById(cartId);
    }

    /**
     * Actualizar la cantidad de un producto en el carrito
     * Si la cantidad es 0 o menor, elimina el producto
     * @param {string} cartId - ID del carrito
     * @param {string} productId - ID del producto
     * @param {number} quantity - Nueva cantidad
     * @returns {Object} Carrito actualizado
     * @throws {Error} Si el carrito o producto no existen
     */
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.cartRepository.findByIdForUpdate(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === productId.toString()
        );

        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        if (quantity <= 0) {
            // Si la cantidad es 0 o menor, eliminar el producto del carrito
            cart.products.splice(productIndex, 1);
        } else {
            // Actualizar la cantidad del producto
            cart.products[productIndex].quantity = quantity;
        }

        await this.cartRepository.save(cart);
        return await this.getCartById(cartId);
    }

    /**
     * Actualizar todos los productos del carrito con un nuevo arreglo
     * Valida que todos los productos existan antes de actualizar
     * @param {string} cartId - ID del carrito
     * @param {Array} products - Arreglo de productos con estructura: [{product: ObjectId, quantity: number}]
     * @returns {Object} Carrito actualizado
     * @throws {Error} Si el carrito no existe o algún producto no existe
     */
    async updateCartProducts(cartId, products) {
        const cart = await this.cartRepository.findByIdForUpdate(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        // Validar que todos los productos existen antes de actualizar
        for (const item of products) {
            const product = await this.productRepository.findById(item.product);
            if (!product) {
                throw new Error(`Producto con ID ${item.product} no encontrado`);
            }
        }

        cart.products = products;
        await this.cartRepository.save(cart);
        return await this.getCartById(cartId);
    }

    /**
     * Vaciar el carrito (eliminar todos los productos)
     * @param {string} cartId - ID del carrito
     * @returns {Object} Carrito vacío
     * @throws {Error} Si el carrito no existe
     */
    async clearCart(cartId) {
        const cart = await this.cartRepository.findByIdForUpdate(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = [];
        await this.cartRepository.save(cart);
        return await this.getCartById(cartId);
    }
}

module.exports = CartService;