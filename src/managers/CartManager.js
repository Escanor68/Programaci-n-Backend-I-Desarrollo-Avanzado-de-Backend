const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
        this.carts = [];
        this.nextId = 1;
        this.init();
    }

    async init() {
        try {
            await this.loadCarts();
            this.updateNextId();
        } catch (error) {
            console.log('Archivo de carritos no existe, se creará uno nuevo');
            await this.saveCarts();
        }
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            throw new Error('Error al guardar carritos: ' + error.message);
        }
    }

    updateNextId() {
        if (this.carts.length > 0) {
            const maxId = Math.max(...this.carts.map(cart => cart.id));
            this.nextId = maxId + 1;
        } else {
            this.nextId = 1;
        }
    }

    async createCart() {
        const newCart = {
            id: this.nextId++,
            products: []
        };

        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(id) {
        await this.loadCarts();
        const cart = this.carts.find(cart => cart.id === id);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        await this.loadCarts();
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
        
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cart = this.carts[cartIndex];
        
        // Buscar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(
            item => item.product === productId
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

        await this.saveCarts();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        await this.loadCarts();
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
        
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cart = this.carts[cartIndex];
        const productIndex = cart.products.findIndex(
            item => item.product === productId
        );

        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        cart.products.splice(productIndex, 1);
        await this.saveCarts();
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        await this.loadCarts();
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
        
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cart = this.carts[cartIndex];
        const productIndex = cart.products.findIndex(
            item => item.product === productId
        );

        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        if (quantity <= 0) {
            // Si la cantidad es 0 o menor, eliminar el producto
            cart.products.splice(productIndex, 1);
        } else {
            cart.products[productIndex].quantity = quantity;
        }

        await this.saveCarts();
        return cart;
    }

    async clearCart(cartId) {
        await this.loadCarts();
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
        
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        this.carts[cartIndex].products = [];
        await this.saveCarts();
        return this.carts[cartIndex];
    }
}

module.exports = CartManager;
