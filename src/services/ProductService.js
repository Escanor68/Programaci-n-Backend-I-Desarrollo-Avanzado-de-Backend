/**
 * Servicio de Productos
 * Contiene la lógica de negocio para productos
 */

const ProductRepository = require('../repositories/ProductRepository');

class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    /**
     * Obtener productos con paginación, filtros y ordenamiento
     * @param {Object} options - Opciones de búsqueda
     * @param {number} options.limit - Número de productos por página (default: 10)
     * @param {number} options.page - Número de página (default: 1)
     * @param {string} options.sort - Ordenamiento: 'asc' o 'desc' por precio
     * @param {string} options.query - Filtro: categoría o 'available' para productos disponibles
     * @returns {Object} Objeto con productos y metadata de paginación
     */
    async getProducts(options = {}) {
        const {
            limit = 10,
            page = 1,
            sort = null,
            query = null
        } = options;

        // Construir filtro de búsqueda
        const filter = {};
        
        if (query) {
            // Si query es 'available', filtrar productos con stock > 0 y status = true
            if (query === 'available') {
                filter.stock = { $gt: 0 };
                filter.status = true;
            } else {
                // Si no, buscar por categoría
                filter.category = query;
            }
        }

        // Construir opciones de ordenamiento por precio
        let sortOption = {};
        if (sort === 'asc') {
            sortOption = { price: 1 }; // Ascendente
        } else if (sort === 'desc') {
            sortOption = { price: -1 }; // Descendente
        }

        // Calcular paginación
        const skip = (page - 1) * limit;
        const totalDocs = await this.productRepository.count(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        // Obtener productos de la base de datos
        const products = await this.productRepository.findAll(filter, sortOption, skip, limit);

        // Construir metadata de paginación
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        // Construir links de navegación
        const baseUrl = '/api/products';
        const queryParams = new URLSearchParams();
        if (limit !== 10) queryParams.set('limit', limit);
        if (query) queryParams.set('query', query);
        if (sort) queryParams.set('sort', sort);

        const prevLink = hasPrevPage 
            ? `${baseUrl}?${queryParams.toString()}&page=${page - 1}`
            : null;
        
        const nextLink = hasNextPage
            ? `${baseUrl}?${queryParams.toString()}&page=${page + 1}`
            : null;

        return {
            status: 'success',
            payload: products,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        };
    }

    /**
     * Obtener un producto por su ID
     * @param {string} id - ID del producto (ObjectId de MongoDB)
     * @returns {Object} Producto encontrado
     * @throws {Error} Si el producto no existe
     */
    async getProductById(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    /**
     * Crear un nuevo producto
     * @param {Object} productData - Datos del producto
     * @param {string} productData.title - Título del producto
     * @param {string} productData.description - Descripción del producto
     * @param {string} productData.code - Código único del producto
     * @param {number} productData.price - Precio del producto
     * @param {boolean} productData.status - Estado del producto (default: true)
     * @param {number} productData.stock - Stock disponible
     * @param {string} productData.category - Categoría del producto
     * @param {Array<string>} productData.thumbnails - Array de URLs de imágenes
     * @returns {Object} Producto creado
     * @throws {Error} Si los datos son inválidos o el código ya existe
     */
    async createProduct(productData) {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = productData;

        // Validar datos del producto
        this.validateProductData(productData);

        // Verificar que el código no se repita (debe ser único)
        const existingProduct = await this.productRepository.findOne({ code });
        if (existingProduct) {
            throw new Error('Ya existe un producto con este código');
        }

        const newProduct = await this.productRepository.create({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        });

        return newProduct;
    }

    /**
     * Actualizar un producto existente
     * @param {string} id - ID del producto a actualizar
     * @param {Object} updateData - Datos a actualizar (parciales)
     * @returns {Object} Producto actualizado
     * @throws {Error} Si el producto no existe o los datos son inválidos
     */
    async updateProduct(id, updateData) {
        // No permitir actualizar el _id de MongoDB
        const { _id, ...dataToUpdate } = updateData;

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
            const existingProduct = await this.productRepository.findOne({ 
                code: dataToUpdate.code,
                _id: { $ne: id }
            });
            if (existingProduct) {
                throw new Error('Ya existe un producto con este código');
            }
        }

        const updatedProduct = await this.productRepository.updateById(id, dataToUpdate);
        if (!updatedProduct) {
            throw new Error('Producto no encontrado');
        }

        return updatedProduct;
    }

    /**
     * Eliminar un producto
     * @param {string} id - ID del producto a eliminar
     * @returns {Object} Producto eliminado
     * @throws {Error} Si el producto no existe
     */
    async deleteProduct(id) {
        const deletedProduct = await this.productRepository.deleteById(id);
        if (!deletedProduct) {
            throw new Error('Producto no encontrado');
        }
        return deletedProduct;
    }

    /**
     * Validar datos de un producto
     * @param {Object} productData - Datos del producto a validar
     * @throws {Error} Si los datos son inválidos
     */
    validateProductData(productData) {
        const { title, description, code, price, stock, category } = productData;

        // Validar campos obligatorios
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Todos los campos son obligatorios');
        }

        // Validar tipos de datos
        if (typeof price !== 'number' || price <= 0) {
            throw new Error('El precio debe ser un número positivo');
        }

        if (typeof stock !== 'number' || stock < 0) {
            throw new Error('El stock debe ser un número mayor o igual a 0');
        }
    }
}

module.exports = ProductService;