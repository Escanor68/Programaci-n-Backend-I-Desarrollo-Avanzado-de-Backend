const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../data/products.json');
        this.products = [];
        this.nextId = 1;
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.updateNextId();
        } catch (error) {
            console.log('Archivo de productos no existe, se creará uno nuevo');
            await this.saveProducts();
        }
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            throw new Error('Error al guardar productos: ' + error.message);
        }
    }

    updateNextId() {
        if (this.products.length > 0) {
            const maxId = Math.max(...this.products.map(product => product.id));
            this.nextId = maxId + 1;
        } else {
            this.nextId = 1;
        }
    }

    async getProducts(limit = null) {
        await this.loadProducts();
        if (limit && limit > 0) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    async getProductById(id) {
        await this.loadProducts();
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async addProduct(productData) {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = productData;

        // Validaciones
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Todos los campos son obligatorios');
        }

        if (typeof price !== 'number' || price <= 0) {
            throw new Error('El precio debe ser un número positivo');
        }

        if (typeof stock !== 'number' || stock < 0) {
            throw new Error('El stock debe ser un número mayor o igual a 0');
        }

        // Verificar que el código no se repita
        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            throw new Error('Ya existe un producto con este código');
        }

        const newProduct = {
            id: this.nextId++,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async updateProduct(id, updateData) {
        await this.loadProducts();
        const productIndex = this.products.findIndex(product => product.id === id);
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        // No permitir actualizar el ID
        const { id: _, ...dataToUpdate } = updateData;

        // Validaciones para campos numéricos
        if (dataToUpdate.price !== undefined) {
            if (typeof dataToUpdate.price !== 'number' || dataToUpdate.price <= 0) {
                throw new Error('El precio debe ser un número positivo');
            }
        }

        if (dataToUpdate.stock !== undefined) {
            if (typeof dataToUpdate.stock !== 'number' || dataToUpdate.stock < 0) {
                throw new Error('El stock debe ser un número mayor o igual a 0');
            }
        }

        // Verificar código único si se está actualizando
        if (dataToUpdate.code) {
            const existingProduct = this.products.find(product => 
                product.code === dataToUpdate.code && product.id !== id
            );
            if (existingProduct) {
                throw new Error('Ya existe un producto con este código');
            }
        }

        this.products[productIndex] = { ...this.products[productIndex], ...dataToUpdate };
        await this.saveProducts();
        return this.products[productIndex];
    }

    async deleteProduct(id) {
        await this.loadProducts();
        const productIndex = this.products.findIndex(product => product.id === id);
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        const deletedProduct = this.products.splice(productIndex, 1)[0];
        await this.saveProducts();
        return deletedProduct;
    }
}

module.exports = ProductManager;
