/**
 * Configuración de conexión a MongoDB
 * Maneja la conexión a la base de datos MongoDB Atlas
 */

const mongoose = require('mongoose');
const config = require('./config');

/**
 * Conectar a MongoDB
 * Si la conexión falla, termina el proceso
 */
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodb.uri, {
            dbName: config.mongodb.dbName
        });
        console.log('✅ MongoDB conectado exitosamente');
    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error.message);
        process.exit(1); // Terminar proceso si no se puede conectar
    }
};

module.exports = connectDB;