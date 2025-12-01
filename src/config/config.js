/**
 * Configuración centralizada de la aplicación
 * Centraliza todas las configuraciones de la aplicación
 */

const config = {
    // Configuración del servidor
    port: 8080,
    nodeEnv: 'development',
    
    // Configuración de MongoDB
    mongodb: {
        uri: 'mongodb+srv://ricardogrebosz_db_user:8ccON8OfETxQYjtl@proyectocoderhouse.n4c7xwl.mongodb.net/?appName=ProyectoCoderHouse',
        dbName: 'ecommerce'
    },
    
    // Configuración de Socket.io
    socket: {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    }
};

module.exports = config;
