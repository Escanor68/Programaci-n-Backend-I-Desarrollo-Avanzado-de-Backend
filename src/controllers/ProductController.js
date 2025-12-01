/**
 * Controlador de Productos
 * Maneja las peticiones HTTP relacionadas con productos
 */

const ProductService = require('../services/ProductService');

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    /**
     * Obtener lista de productos con paginación, filtros y ordenamiento
     * @param {Object} req - Request object con query params: limit, page, sort, query
     * @param {Object} res - Response object
     */
    async getProducts(req, res) {
        try {
            const { limit, page, sort, query } = req.query;
            
            const options = {
                limit: limit ? parseInt(limit) : 10,
                page: page ? parseInt(page) : 1,
                sort: sort || null,
                query: query || null
            };

            const result = await this.productService.getProducts(options);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    /**
     * Obtener un producto por su ID
     * La validación del ObjectId se hace en el middleware
     * @param {Object} req - Request object con param: pid (product ID)
     * @param {Object} res - Response object
     */
    async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const product = await this.productService.getProductById(pid);
            
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
    }

    /**
     * Crear un nuevo producto
     * Emite eventos de Socket.io para actualizar clientes en tiempo real
     * @param {Object} req - Request object con body: productData
     * @param {Object} res - Response object
     */
    async createProduct(req, res) {
        try {
            const productData = req.body;
            const newProduct = await this.productService.createProduct(productData);
            
            // Emitir evento de socket si está disponible para actualizar vistas en tiempo real
            const io = req.app.get('io');
            if (io) {
                const productsResult = await this.productService.getProducts({ limit: 10, page: 1 });
                io.emit('productsUpdated', productsResult.payload);
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
    }

    /**
     * Actualizar un producto existente
     * La validación del ObjectId se hace en el middleware
     * @param {Object} req - Request object con param: pid y body: updateData
     * @param {Object} res - Response object
     */
    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const updateData = req.body;
            const updatedProduct = await this.productService.updateProduct(pid, updateData);
            
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
    }

    /**
     * Eliminar un producto
     * Emite eventos de Socket.io para actualizar clientes en tiempo real
     * La validación del ObjectId se hace en el middleware
     * @param {Object} req - Request object con param: pid
     * @param {Object} res - Response object
     */
    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            const deletedProduct = await this.productService.deleteProduct(pid);
            
            // Emitir evento de socket si está disponible para actualizar vistas en tiempo real
            const io = req.app.get('io');
            if (io) {
                const productsResult = await this.productService.getProducts({ limit: 10, page: 1 });
                io.emit('productsUpdated', productsResult.payload);
                io.emit('productDeleted', pid);
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
    }
}

module.exports = ProductController;