const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

// Configurar Handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Hacer disponible io en las rutas
app.set('io', io);

// Rutas de vistas (deben ir antes de las rutas API)
app.use('/', viewsRouter);

// Rutas principales API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta de bienvenida API
app.get('/api', (req, res) => {
    res.json({
        message: 'API de Productos y Carritos',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts',
            views: {
                home: '/',
                realtime: '/realtimeproducts'
            }
        }
    });
});

// Configurar Socket.io
const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Manejar agregar producto desde WebSocket
    socket.on('addProduct', async (productData) => {
        try {
            const newProduct = await productManager.addProduct(productData);
            const products = await productManager.getProducts();
            
            // Emitir a todos los clientes
            io.emit('productsUpdated', products);
            io.emit('productAdded', newProduct);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    // Manejar eliminar producto desde WebSocket
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const products = await productManager.getProducts();
            
            // Emitir a todos los clientes
            io.emit('productsUpdated', products);
            io.emit('productDeleted', productId);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
});

// Iniciar servidor HTTP con Socket.io
httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('Endpoints disponibles:');
    console.log('Vistas:');
    console.log('- GET / - Home');
    console.log('- GET /realtimeproducts - Productos en tiempo real');
    console.log('API:');
    console.log('- GET /api/products');
    console.log('- GET /api/products/:pid');
    console.log('- POST /api/products');
    console.log('- PUT /api/products/:pid');
    console.log('- DELETE /api/products/:pid');
    console.log('- POST /api/carts');
    console.log('- GET /api/carts/:cid');
    console.log('- POST /api/carts/:cid/product/:pid');
    console.log('- PUT /api/carts/:cid/product/:pid');
    console.log('- DELETE /api/carts/:cid/product/:pid');
    console.log('- DELETE /api/carts/:cid');
    console.log('\nSocket.io configurado y listo para conexiones');
});

module.exports = { app, io };