const express = require('express');
const ViewController = require('../controllers/ViewController');

const router = express.Router();
const viewController = new ViewController();

// GET / - Redirigir a /products
router.get('/', (req, res) => {
    res.redirect('/products');
});

// GET /products - Vista de productos con paginación
router.get('/products', (req, res) => viewController.getProductsView(req, res));

// GET /products/:pid - Vista de detalle de producto
router.get('/products/:pid', (req, res) => viewController.getProductDetailView(req, res));

// GET /carts/:cid - Vista de carrito específico
router.get('/carts/:cid', (req, res) => viewController.getCartView(req, res));

// GET /realtimeproducts - Vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => viewController.getRealTimeProductsView(req, res));

module.exports = router;