const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// GET / - Vista home con lista de productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', {
            title: 'Lista de Productos',
            products: products
        });
    } catch (error) {
        res.status(500).render('home', {
            title: 'Lista de Productos',
            products: [],
            error: error.message
        });
    }
});

// GET /realtimeproducts - Vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', {
            title: 'Productos en Tiempo Real',
            products: products,
            socketio: true
        });
    } catch (error) {
        res.status(500).render('realTimeProducts', {
            title: 'Productos en Tiempo Real',
            products: [],
            socketio: true,
            error: error.message
        });
    }
});

module.exports = router;
