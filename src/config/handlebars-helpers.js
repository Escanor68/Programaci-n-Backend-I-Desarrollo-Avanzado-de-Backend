/**
 * Helpers personalizados para Handlebars
 * Funciones auxiliares para usar en las plantillas
 */

const helpers = {
    /**
     * Comparar si dos valores son iguales
     * @param {*} a - Primer valor
     * @param {*} b - Segundo valor
     * @returns {boolean} true si son iguales
     */
    eq: function(a, b) {
        return a === b;
    },
    
    /**
     * Multiplicar dos números y formatear a 2 decimales
     * @param {number} a - Primer número
     * @param {number} b - Segundo número
     * @returns {string} Resultado formateado con 2 decimales
     */
    multiply: function(a, b) {
        return (a * b).toFixed(2);
    }
};

module.exports = helpers;