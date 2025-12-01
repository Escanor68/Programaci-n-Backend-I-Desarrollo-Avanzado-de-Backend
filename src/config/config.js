/**
 * Configuración centralizada de la aplicación
 * Centraliza todas las variables de entorno y configuraciones
 */

require('dotenv').config();

const config = {
    // Configuración del servidor
    port: process.env.PORT || 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Configuración de MongoDB
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb+srv://ricardogrebosz_db_user:8ccON8OfETxQYjtl@proyectocoderhouse.n4c7xwl.mongodb.net/?appName=ProyectoCoderHouse',
        dbName: process.env.DB_NAME || 'ecommerce'
    },
    
    // Configuración de Socket.io
    socket: {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST']
        }
    }
};

module.exports = config;
