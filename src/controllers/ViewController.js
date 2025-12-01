/**
 * Controlador de Vistas
 * Maneja el renderizado de las vistas Handlebars
 */

const ProductService = require('../services/ProductService');
const CartService = require('../services/CartService');

class ViewController {
    constructor() {
        this.productService = new ProductService();
        this.cartService = new CartService();
    }

    /**
     * Renderizar vista de productos con paginación
     * @param {Object} req - Request object con query params: limit, page, sort, query
     * @param {Object} res - Response object
     */
    async getProductsView(req, res) {
        try {
            const { limit, page, sort, query } = req.query;
            
            const options = {
                limit: limit ? parseInt(limit) : 10,
                page: page ? parseInt(page) : 1,
                sort: sort || null,
                query: query || null
            };

            const result = await this.productService.getProducts(options);
            
            res.render('products', {
                title: 'Productos',
                products: result.payload,
                pagination: {
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.prevLink,
                    nextLink: result.nextLink
                },
                currentQuery: query || '',
                currentSort: sort || '',
                currentLimit: options.limit
            });
        } catch (error) {
            res.status(500).render('products', {
                title: 'Productos',
                products: [],
                pagination: null,
                error: error.message
            });
        }
    }

    /**
     * Renderizar vista de detalle de producto
     * @param {Object} req - Request object con param: pid
     * @param {Object} res - Response object
     */
    async getProductDetailView(req, res) {
        try {
            const { pid } = req.params;
            const product = await this.productService.getProductById(pid);
            
            res.render('productDetail', {
                title: product.title,
                product: product
            });
        } catch (error) {
            res.status(404).render('error', {
                title: 'Producto no encontrado',
                message: error.message
            });
        }
    }

    /**
     * Renderizar vista de carrito específico
     * @param {Object} req - Request object con param: cid
     * @param {Object} res - Response object
     */
    async getCartView(req, res) {
        try {
            const { cid } = req.params;
            const cart = await this.cartService.getCartById(cid);
            
            res.render('cart', {
                title: 'Carrito de Compras',
                cart: cart,
                cartId: cart._id
            });
        } catch (error) {
            res.status(404).render('error', {
                title: 'Carrito no encontrado',
                message: error.message
            });
        }
    }

    /**
     * Renderizar vista de productos en tiempo real (con Socket.io)
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getRealTimeProductsView(req, res) {
        try {
            // Obtener hasta 100 productos para la vista en tiempo real
            const result = await this.productService.getProducts({ limit: 100, page: 1 });
            res.render('realTimeProducts', {
                title: 'Productos en Tiempo Real',
                products: result.payload,
                socketio: true // Flag para incluir Socket.io en el layout
            });
        } catch (error) {
            res.status(500).render('realTimeProducts', {
                title: 'Productos en Tiempo Real',
                products: [],
                socketio: true,
                error: error.message
            });
        }
    }
}

module.exports = ViewController;