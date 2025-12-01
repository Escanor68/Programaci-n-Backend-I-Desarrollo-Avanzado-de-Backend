/**
 * Handlers de Socket.io
 * Maneja todos los eventos de WebSocket para comunicación en tiempo real
 */

const ProductService = require('../services/ProductService');

/**
 * Configurar y manejar eventos de Socket.io
 * @param {Server} io - Instancia de Socket.io Server
 */
const configureSocketHandlers = (io) => {
    const productService = new ProductService();

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        /**
         * Manejar creación de producto desde WebSocket
         * Emite eventos a todos los clientes conectados
         */
        socket.on('addProduct', async (productData) => {
            try {
                const newProduct = await productService.createProduct(productData);
                const productsResult = await productService.getProducts({ limit: 10, page: 1 });
                
                // Notificar a todos los clientes sobre la actualización
                io.emit('productsUpdated', productsResult.payload);
                io.emit('productAdded', newProduct);
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * Manejar eliminación de producto desde WebSocket
         * Emite eventos a todos los clientes conectados
         */
        socket.on('deleteProduct', async (productId) => {
            try {
                await productService.deleteProduct(productId);
                const productsResult = await productService.getProducts({ limit: 10, page: 1 });
                
                // Notificar a todos los clientes sobre la actualización
                io.emit('productsUpdated', productsResult.payload);
                io.emit('productDeleted', productId);
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * Manejar desconexión de cliente
         */
        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
};

module.exports = configureSocketHandlers;
