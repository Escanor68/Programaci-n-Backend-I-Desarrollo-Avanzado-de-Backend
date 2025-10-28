# Node.js no está instalado

Para ejecutar este proyecto necesitas instalar Node.js:

## Instalación de Node.js

1. Ve a https://nodejs.org/
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Reinicia tu terminal/PowerShell

## Después de instalar Node.js

1. Ejecuta `npm install` para instalar las dependencias
2. Ejecuta `npm start` para iniciar el servidor
3. El servidor estará disponible en http://localhost:8080

## Scripts disponibles

- `npm start` - Inicia el servidor
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon

## Estructura del proyecto

```
src/
├── app.js              # Servidor principal
├── routes/
│   ├── products.js     # Rutas de productos
│   └── carts.js        # Rutas de carritos
├── managers/
│   ├── ProductManager.js
│   └── CartManager.js
└── data/
    ├── products.json
    └── carts.json
```

## Endpoints disponibles

### Productos (/api/products/)
- `GET /` - Listar todos los productos
- `GET /:pid` - Obtener producto por ID
- `POST /` - Crear nuevo producto
- `PUT /:pid` - Actualizar producto
- `DELETE /:pid` - Eliminar producto

### Carritos (/api/carts/)
- `POST /` - Crear nuevo carrito
- `GET /:cid` - Listar productos del carrito
- `POST /:cid/product/:pid` - Agregar producto al carrito
- `PUT /:cid/product/:pid` - Actualizar cantidad de producto
- `DELETE /:cid/product/:pid` - Eliminar producto del carrito
- `DELETE /:cid` - Vaciar carrito

## Ejemplo de uso con Postman

### Crear un producto:
```
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "title": "Producto de prueba",
  "description": "Descripción del producto",
  "code": "PROD001",
  "price": 100,
  "status": true,
  "stock": 50,
  "category": "Categoría 1",
  "thumbnails": ["imagen1.jpg", "imagen2.jpg"]
}
```

### Crear un carrito:
```
POST http://localhost:8080/api/carts
```

### Agregar producto al carrito:
```
POST http://localhost:8080/api/carts/1/product/1
```
