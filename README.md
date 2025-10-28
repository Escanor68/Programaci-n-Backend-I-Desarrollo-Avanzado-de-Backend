# Backend API - Productos y Carritos

## Descripción
API desarrollada con Node.js y Express para la gestión de productos y carritos de compra.

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm start
```

## Desarrollo
```bash
npm run dev
```

## Endpoints

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

## Estructura del Proyecto
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