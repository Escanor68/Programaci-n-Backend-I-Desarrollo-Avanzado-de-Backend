const socket = io();

// Función para mostrar alertas
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Función para renderizar productos
function renderProducts(products) {
    const container = document.getElementById('products-container');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="no-products"><p>No hay productos disponibles</p></div>';
        return;
    }
    
    const grid = document.createElement('div');
    grid.className = 'products-grid';
    grid.id = 'products-grid';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        card.innerHTML = `
            <h3>${product.title}</h3>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><span class="code">Código: ${product.code}</span></p>
            <p class="price">$${product.price}</p>
            <p class="stock">Stock: ${product.stock} unidades</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>Estado:</strong> ${product.status ? 'Activo' : 'Inactivo'}</p>
            ${product.thumbnails && product.thumbnails.length > 0 ? `<p><strong>Imágenes:</strong> ${product.thumbnails.length}</p>` : ''}
            <button class="btn-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
        `;
        grid.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(grid);
}

// Escuchar actualización de productos desde el servidor
socket.on('productsUpdated', (products) => {
    renderProducts(products);
    showAlert('Lista de productos actualizada', 'success');
});

// Escuchar cuando se agrega un producto
socket.on('productAdded', (product) => {
    showAlert(`Producto "${product.title}" agregado exitosamente`, 'success');
});

// Escuchar cuando se elimina un producto
socket.on('productDeleted', (productId) => {
    showAlert(`Producto eliminado exitosamente`, 'success');
});

// Escuchar errores
socket.on('error', (error) => {
    showAlert(error.message || 'Ocurrió un error', 'error');
});

// Manejar el formulario de agregar producto
document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category'),
        status: formData.get('status') === 'true',
        thumbnails: formData.get('thumbnails') 
            ? formData.get('thumbnails').split(',').map(t => t.trim()).filter(t => t)
            : []
    };
    
    // Emitir evento para agregar producto
    socket.emit('addProduct', productData);
    
    // Limpiar formulario
    e.target.reset();
});

// Función para eliminar producto
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        socket.emit('deleteProduct', productId);
    }
}
