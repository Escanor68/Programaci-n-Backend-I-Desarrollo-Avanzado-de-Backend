# 📚 Ejemplos de Uso de la API

## 🚀 Instalación y Ejecución

1. Instalar Node.js desde https://nodejs.org/
2. Ejecutar `npm install` para instalar dependencias
3. Ejecutar `npm start` para iniciar el servidor
4. El servidor estará disponible en **http://localhost:8080**

## 🌐 Vistas Web

### Vista Home
```
GET http://localhost:8080/
```
Muestra la lista completa de productos en formato HTML.

### Vista Tiempo Real
```
GET http://localhost:8080/realtimeproducts
```
Muestra la lista de productos con actualizaciones en tiempo real usando WebSockets.

## 📡 Ejemplos de Requests con Postman

### 1. Obtener todos los productos
```
GET http://localhost:8080/api/products
```

**Respuesta:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Laptop Gaming",
      "description": "Laptop de alto rendimiento para gaming",
      "code": "LAP001",
      "price": 1200,
      "status": true,
      "stock": 10,
      "category": "Electrónicos",
      "thumbnails": ["laptop1.jpg", "laptop2.jpg"]
    }
  ]
}
```

### 2. Obtener un producto por ID
```
GET http://localhost:8080/api/products/1
```

**Respuesta:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Laptop Gaming",
    "description": "Laptop de alto rendimiento para gaming",
    "code": "LAP001",
    "price": 1200,
    "status": true,
    "stock": 10,
    "category": "Electrónicos",
    "thumbnails": ["laptop1.jpg", "laptop2.jpg"]
  }
}
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

**Respuesta:**
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

**Nota:** Este endpoint también emite eventos de Socket.io, por lo que todos los clientes conectados en `/realtimeproducts` verán la actualización automáticamente.

### 4. Actualizar un producto
```
PUT http://localhost:8080/api/products/1
Content-Type: application/json

{
  "price": 1100,
  "stock": 8
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 1,
    "title": "Laptop Gaming",
    "description": "Laptop de alto rendimiento para gaming",
    "code": "LAP001",
    "price": 1100,
    "status": true,
    "stock": 8,
    "category": "Electrónicos",
    "thumbnails": ["laptop1.jpg", "laptop2.jpg"]
  }
}
```

### 5. Eliminar un producto
```
DELETE http://localhost:8080/api/products/1
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto eliminado exitosamente",
  "data": {
    "id": 1,
    "title": "Laptop Gaming",
    ...
  }
}
```

**Nota:** Este endpoint también emite eventos de Socket.io, por lo que todos los clientes conectados verán la eliminación automáticamente.

### 6. Crear un nuevo carrito
```
POST http://localhost:8080/api/carts
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Carrito creado exitosamente",
  "data": {
    "id": 1,
    "products": []
  }
}
```

### 7. Obtener productos de un carrito
```
GET http://localhost:8080/api/carts/1
```

**Respuesta:**
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

### 8. Agregar producto al carrito
```
POST http://localhost:8080/api/carts/1/product/2
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto agregado al carrito exitosamente",
  "data": {
    "id": 1,
    "products": [
      {
        "product": 2,
        "quantity": 1
      }
    ]
  }
}
```

**Nota:** Si el producto ya existe en el carrito, se incrementa la cantidad automáticamente.

### 9. Actualizar cantidad de producto en el carrito
```
PUT http://localhost:8080/api/carts/1/product/2
Content-Type: application/json

{
  "quantity": 3
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Cantidad de producto actualizada exitosamente",
  "data": {
    "id": 1,
    "products": [
      {
        "product": 2,
        "quantity": 3
      }
    ]
  }
}
```

### 10. Eliminar producto del carrito
```
DELETE http://localhost:8080/api/carts/1/product/2
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto eliminado del carrito exitosamente",
  "data": {
    "id": 1,
    "products": []
  }
}
```

### 11. Vaciar carrito
```
DELETE http://localhost:8080/api/carts/1
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Carrito vaciado exitosamente",
  "data": {
    "id": 1,
    "products": []
  }
}
```

## ⚠️ Errores Comunes

### Error: Producto no encontrado
```json
{
  "status": "error",
  "message": "Producto no encontrado"
}
```

### Error: Validación de campos
```json
{
  "status": "error",
  "message": "Todos los campos son obligatorios"
}
```

### Error: Código duplicado
```json
{
  "status": "error",
  "message": "Ya existe un producto con este código"
}
```

### Error: Tipo de dato incorrecto
```json
{
  "status": "error",
  "message": "El precio debe ser un número positivo"
}
```

## 🔄 Integración con WebSockets

Los endpoints `POST /api/products` y `DELETE /api/products/:pid` emiten eventos de Socket.io automáticamente:

- `productsUpdated` - Lista completa de productos actualizada
- `productAdded` - Producto agregado (solo en POST)
- `productDeleted` - ID del producto eliminado (solo en DELETE)

Esto permite que las vistas web se actualicen en tiempo real cuando se realizan cambios desde la API REST.

## 📝 Notas Importantes

- Los IDs se autogeneran automáticamente
- El campo `code` debe ser único
- El campo `status` es opcional (por defecto `true`)
- El campo `thumbnails` es opcional (por defecto array vacío)
- Los precios y stock deben ser números positivos
- Los cambios se guardan automáticamente en `src/data/products.json` y `src/data/carts.json`