/**
 * Servidor principal de la aplicación
 * Configura Express, Handlebars, Socket.io y MongoDB
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const connectDB = require('./config/database');
const config = require('./config/config');

// Importar rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

// Importar configuración de Socket.io
const configureSocketHandlers = require('./sockets');

// Inicializar Express y servidor HTTP
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: config.socket.cors
});
const PORT = config.port;

// Conectar a MongoDB antes de iniciar el servidor
connectDB();

// Configurar Handlebars como motor de plantillas
const handlebarsHelpers = require('./config/handlebars-helpers');
const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: handlebarsHelpers
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON y URL-encoded en el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de todas las peticiones HTTP
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    // Debug: mostrar si es una petición de API
    if (req.path.startsWith('/api')) {
        console.log(`  → Ruta de API detectada: ${req.path}`);
    }
    next();
});

// Hacer disponible la instancia de Socket.io en las rutas para emitir eventos
app.set('io', io);

// Rutas principales de la API REST (deben ir ANTES de las rutas de vistas)
console.log('📡 Registrando rutas de API...');
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
console.log('✅ Rutas de API registradas');

// Ruta de información de la API
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

// Rutas de vistas (después de las rutas API)
console.log('🌐 Registrando rutas de vistas...');
app.use('/', viewsRouter);
console.log('✅ Rutas de vistas registradas');

// Configurar eventos de Socket.io para comunicación en tiempo real
configureSocketHandlers(io);

// Middleware para manejar rutas no encontradas (404)
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

// Middleware global para manejo de errores (500)
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
    console.log('- GET / - Redirige a /products');
    console.log('- GET /products - Lista de productos con paginación');
    console.log('- GET /products/:pid - Detalle de producto');
    console.log('- GET /carts/:cid - Vista de carrito');
    console.log('- GET /realtimeproducts - Productos en tiempo real');
    console.log('API:');
    console.log('- GET /api/products - Listar productos (con paginación, filtros y ordenamiento)');
    console.log('- GET /api/products/:pid - Obtener producto por ID');
    console.log('- POST /api/products - Crear nuevo producto');
    console.log('- PUT /api/products/:pid - Actualizar producto');
    console.log('- DELETE /api/products/:pid - Eliminar producto');
    console.log('- POST /api/carts - Crear nuevo carrito');
    console.log('- GET /api/carts/:cid - Obtener carrito con productos');
    console.log('- POST /api/carts/:cid/product/:pid - Agregar producto al carrito');
    console.log('- PUT /api/carts/:cid/products/:pid - Actualizar cantidad de producto');
    console.log('- PUT /api/carts/:cid - Actualizar todos los productos del carrito');
    console.log('- DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito');
    console.log('- DELETE /api/carts/:cid - Vaciar carrito');
    console.log('\nSocket.io configurado y listo para conexiones');
});

module.exports = { app, io };