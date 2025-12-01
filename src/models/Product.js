/**
 * Modelo de Producto
 * Define el esquema y validaciones para productos en MongoDB
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true // El código debe ser único
    },
    price: {
        type: Number,
        required: true,
        min: 0 // El precio no puede ser negativo
    },
    status: {
        type: Boolean,
        default: true // Por defecto el producto está activo
    },
    stock: {
        type: Number,
        required: true,
        min: 0 // El stock no puede ser negativo
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: [String], // Array de strings (URLs de imágenes)
        default: []
    }
}, {
    timestamps: true // Agrega automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Product', productSchema);