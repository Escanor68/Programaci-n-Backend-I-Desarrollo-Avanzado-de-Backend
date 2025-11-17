const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// GET /api/products/ - Listar todos los productos
router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts(limit ? parseInt(limit) : null);
        res.json({
            status: 'success',
            data: products
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /api/products/:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productId = parseInt(pid);
        
        if (isNaN(productId)) {
            return res.status(400).json({
                status: 'error',
                message: 'El ID del producto debe ser un número'
            });
        }

        const product = await productManager.getProductById(productId);
        res.json({
            status: 'success',
            data: product
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST /api/products/ - Crear nuevo producto
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await productManager.addProduct(productData);
        
        // Obtener io del app y emitir evento de socket
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getProducts();
            io.emit('productsUpdated', products);
            io.emit('productAdded', newProduct);
        }
        
        res.status(201).json({
            status: 'success',
            message: 'Producto creado exitosamente',
            data: newProduct
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// PUT /api/products/:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productId = parseInt(pid);
        
        if (isNaN(productId)) {
            return res.status(400).json({
                status: 'error',
                message: 'El ID del producto debe ser un número'
            });
        }

        const updateData = req.body;
        const updatedProduct = await productManager.updateProduct(productId, updateData);
        
        res.json({
            status: 'success',
            message: 'Producto actualizado exitosamente',
            data: updatedProduct
        });
    } catch (error) {
        const statusCode = error.message === 'Producto no encontrado' ? 404 : 400;
        res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
});

// DELETE /api/products/:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productId = parseInt(pid);
        
        if (isNaN(productId)) {
            return res.status(400).json({
                status: 'error',
                message: 'El ID del producto debe ser un número'
            });
        }

        const deletedProduct = await productManager.deleteProduct(productId);
        
        // Obtener io del app y emitir evento de socket
        const io = req.app.get('io');
        if (io) {
            const products = await productManager.getProducts();
            io.emit('productsUpdated', products);
            io.emit('productDeleted', productId);
        }
        
        res.json({
            status: 'success',
            message: 'Producto eliminado exitosamente',
            data: deletedProduct
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
