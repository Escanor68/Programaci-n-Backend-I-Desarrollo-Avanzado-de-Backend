/**
 * Rutas de Productos
 * Define los endpoints para la gestión de productos
 */

const express = require('express');
const ProductController = require('../controllers/ProductController');
const { validators, productValidator } = require('../middlewares');

const router = express.Router();
const productController = new ProductController();

// GET /api/products/ - Listar productos con paginación, filtros y ordenamiento
router.get('/', (req, res) => productController.getProducts(req, res));

// GET /api/products/:pid - Obtener producto por ID
router.get('/:pid', validators.validateObjectId('pid'), (req, res) => productController.getProductById(req, res));

// POST /api/products/ - Crear nuevo producto
router.post('/', productValidator.validateProductCreate, (req, res) => productController.createProduct(req, res));

// PUT /api/products/:pid - Actualizar producto
router.put('/:pid', validators.validateObjectId('pid'), productValidator.validateProductUpdate, (req, res) => productController.updateProduct(req, res));

// DELETE /api/products/:pid - Eliminar producto
router.delete('/:pid', validators.validateObjectId('pid'), (req, res) => productController.deleteProduct(req, res));

module.exports = router;