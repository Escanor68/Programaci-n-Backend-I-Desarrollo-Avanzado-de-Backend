# Ejemplos de uso de la API

## Instalación y ejecución

1. Instalar Node.js desde https://nodejs.org/
2. Ejecutar `npm install` para instalar dependencias
3. Ejecutar `npm start` para iniciar el servidor
4. El servidor estará disponible en http://localhost:8080

## Ejemplos de requests con Postman

### 1. Obtener todos los productos
```
GET http://localhost:8080/api/products
```

### 2. Obtener un producto por ID
```
GET http://localhost:8080/api/products/1
```

### 3. Crear un nuevo producto
```
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "title": "Monitor 24 pulgadas",
  "description": "Monitor LED Full HD",
  "code": "MON001",
  "price": 200,
  "status": true,
  "stock": 15,
  "category": "Electrónicos",
  "thumbnails": ["monitor1.jpg"]
}
```

### 4. Actualizar un producto
```
PUT http://localhost:8080/api/products/1
Content-Type: application/json

{
  "price": 1100,
  "stock": 8
}
```

### 5. Eliminar un producto
```
DELETE http://localhost:8080/api/products/1
```

### 6. Crear un nuevo carrito
```
POST http://localhost:8080/api/carts
```

### 7. Obtener productos de un carrito
```
GET http://localhost:8080/api/carts/1
```

### 8. Agregar producto al carrito
```
POST http://localhost:8080/api/carts/1/product/2
```

### 9. Actualizar cantidad de producto en el carrito
```
PUT http://localhost:8080/api/carts/1/product/2
Content-Type: application/json

{
  "quantity": 3
}
```

### 10. Eliminar producto del carrito
```
DELETE http://localhost:8080/api/carts/1/product/2
```

### 11. Vaciar carrito
```
DELETE http://localhost:8080/api/carts/1
```

## Respuestas de ejemplo

### Producto creado exitosamente
```json
{
  "status": "success",
  "message": "Producto creado exitosamente",
  "data": {
    "id": 4,
    "title": "Monitor 24 pulgadas",
    "description": "Monitor LED Full HD",
    "code": "MON001",
    "price": 200,
    "status": true,
    "stock": 15,
    "category": "Electrónicos",
    "thumbnails": ["monitor1.jpg"]
  }
}
```

### Carrito con productos
```json
{
  "status": "success",
  "data": {
    "cartId": 1,
    "products": [
      {
        "product": 2,
        "quantity": 3,
        "productDetails": {
          "id": 2,
          "title": "Mouse Inalámbrico",
          "description": "Mouse ergonómico inalámbrico",
          "code": "MOU001",
          "price": 25,
          "status": true,
          "stock": 50,
          "category": "Accesorios",
          "thumbnails": ["mouse1.jpg"]
        }
      }
    ]
  }
}
```

### Error de validación
```json
{
  "status": "error",
  "message": "Todos los campos son obligatorios"
}
```
