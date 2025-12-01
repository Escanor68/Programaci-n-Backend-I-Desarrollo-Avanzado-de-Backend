/**
 * Modelo de Carrito
 * Define el esquema y validaciones para carritos de compra en MongoDB
 */

const mongoose = require('mongoose');

// Esquema para los items del carrito (productos con cantidad)
const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Referencia al modelo Product para populate
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, // La cantidad mínima es 1
        default: 1
    }
}, {
    _id: true // Mantener el _id de cada item del carrito
});

// Esquema principal del carrito
const cartSchema = new mongoose.Schema({
    products: {
        type: [cartItemSchema], // Array de items del carrito
        default: []
    }
}, {
    timestamps: true // Agrega automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Cart', cartSchema);