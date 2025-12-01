/**
 * Rutas de Carritos
 * Define los endpoints para la gestión de carritos de compra
 */

const express = require('express');
const CartController = require('../controllers/CartController');
const { validators } = require('../middlewares');

const router = express.Router();
const cartController = new CartController();

// POST /api/carts/ - Crear nuevo carrito
router.post('/', (req, res) => cartController.createCart(req, res));

// GET /api/carts/:cid - Listar productos del carrito (con populate)
router.get('/:cid', validators.validateObjectId('cid'), (req, res) => cartController.getCartById(req, res));

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', 
    validators.validateMultipleObjectIds(['cid', 'pid']), 
    (req, res) => cartController.addProductToCart(req, res)
);

// PUT /api/carts/:cid/products/:pid - Actualizar SOLO la cantidad de producto
router.put('/:cid/products/:pid', 
    validators.validateMultipleObjectIds(['cid', 'pid']),
    validators.validateRequiredField('quantity'),
    validators.validatePositiveNumber('quantity'),
    (req, res) => cartController.updateProductQuantity(req, res)
);

// PUT /api/carts/:cid - Actualizar todos los productos del carrito
router.put('/:cid', 
    validators.validateObjectId('cid'),
    validators.validateArray('products'),
    (req, res) => cartController.updateCartProducts(req, res)
);

// DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito
router.delete('/:cid/products/:pid', 
    validators.validateMultipleObjectIds(['cid', 'pid']), 
    (req, res) => cartController.removeProductFromCart(req, res)
);

// DELETE /api/carts/:cid - Eliminar todos los productos del carrito
router.delete('/:cid', validators.validateObjectId('cid'), (req, res) => cartController.clearCart(req, res));

module.exports = router;