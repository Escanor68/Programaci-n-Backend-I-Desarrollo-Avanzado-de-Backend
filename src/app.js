const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const PORT = 8080;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'API de Productos y Carritos',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        }
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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('Endpoints disponibles:');
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
});

module.exports = app;
