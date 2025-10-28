const express = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

// POST /api/carts/ - Crear nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        
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
});

// GET /api/carts/:cid - Listar productos del carrito
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartId = parseInt(cid);
        
        if (isNaN(cartId)) {
            return res.status(400).json({
                status: 'error',
                message: 'El ID del carrito debe ser un número'
            });
        }

        const cart = await cartManager.getCartById(cartId);
        
        // Obtener información completa de los productos
        const productsWithDetails = [];
        for (const item of cart.products) {
            try {
                const product = await productManager.getProductById(item.product);
                productsWithDetails.push({
                    ...item,
                    productDetails: product
                });
            } catch (error) {
                // Si el producto no existe, agregarlo sin detalles
                productsWithDetails.push({
                    ...item,
                    productDetails: null,
                    error: 'Producto no encontrado'
                });
            }
        }

        res.json({
            status: 'success',
            data: {
                cartId: cart.id,
                products: productsWithDetails
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartId = parseInt(cid);
        const productId = parseInt(pid);
        
        if (isNaN(cartId) || isNaN(productId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Los IDs del carrito y producto deben ser números'
            });
        }

        // Verificar que el producto existe
        await productManager.getProductById(productId);

        // Agregar producto al carrito (cantidad por defecto: 1)
        const updatedCart = await cartManager.addProductToCart(cartId, productId, 1);
        
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
});

// PUT /api/carts/:cid/product/:pid - Actualizar cantidad de producto en el carrito
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cartId = parseInt(cid);
        const productId = parseInt(pid);
        
        if (isNaN(cartId) || isNaN(productId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Los IDs del carrito y producto deben ser números'
            });
        }

        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'La cantidad debe ser un número mayor o igual a 0'
            });
        }

        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        
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
});

// DELETE /api/carts/:cid/product/:pid - Eliminar producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartId = parseInt(cid);
        const productId = parseInt(pid);
        
        if (isNaN(cartId) || isNaN(productId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Los IDs del carrito y producto deben ser números'
            });
        }

        const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
        
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
});

// DELETE /api/carts/:cid - Vaciar carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartId = parseInt(cid);
        
        if (isNaN(cartId)) {
            return res.status(400).json({
                status: 'error',
                message: 'El ID del carrito debe ser un número'
            });
        }

        const clearedCart = await cartManager.clearCart(cartId);
        
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
});

module.exports = router;
