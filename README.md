# Backend API - Productos y Carritos

## 📋 Descripción
API desarrollada con Node.js y Express para la gestión de productos y carritos de compra, con integración de Handlebars para vistas y Socket.io para actualizaciones en tiempo real.

## 🚀 Características

### Entrega N° 1
- ✅ API REST completa para productos y carritos
- ✅ Persistencia en archivos JSON
- ✅ Validaciones y manejo de errores
- ✅ ProductManager y CartManager

### Entrega N° 2
- ✅ Motor de plantillas Handlebars
- ✅ Vistas web con diseño moderno
- ✅ Socket.io para actualizaciones en tiempo real
- ✅ Integración HTTP + WebSockets

## 📦 Instalación

1. **Instalar Node.js** desde https://nodejs.org/ (versión LTS recomendada)

2. **Instalar dependencias**:
```bash
npm install
```

## ▶️ Ejecución

### Modo Producción
```bash
npm start
```

### Modo Desarrollo (con nodemon)
```bash
npm run dev
```

El servidor estará disponible en **http://localhost:8080**

## 🌐 Vistas Web

### Home
- **URL**: `http://localhost:8080/`
- Lista estática de todos los productos

### Productos en Tiempo Real
- **URL**: `http://localhost:8080/realtimeproducts`
- Lista de productos con actualizaciones en tiempo real
- Formulario para agregar productos
- Botones para eliminar productos
- Actualización automática cuando otros clientes realizan cambios

## 📡 Endpoints API

### Productos (`/api/products/`)
- `GET /` - Listar todos los productos
- `GET /:pid` - Obtener producto por ID
- `POST /` - Crear nuevo producto
- `PUT /:pid` - Actualizar producto
- `DELETE /:pid` - Eliminar producto

### Carritos (`/api/carts/`)
- `POST /` - Crear nuevo carrito
- `GET /:cid` - Listar productos del carrito
- `POST /:cid/product/:pid` - Agregar producto al carrito
- `PUT /:cid/product/:pid` - Actualizar cantidad de producto
- `DELETE /:cid/product/:pid` - Eliminar producto del carrito
- `DELETE /:cid` - Vaciar carrito

## 🏗️ Estructura del Proyecto

```
src/
├── app.js                      # Servidor principal (Express + Socket.io)
├── routes/
│   ├── products.js            # Rutas API de productos
│   ├── carts.js               # Rutas API de carritos
│   └── views.js               # Rutas de vistas web
├── views/
│   ├── layouts/
│   │   └── main.handlebars    # Layout principal
│   ├── home.handlebars        # Vista home
│   └── realTimeProducts.handlebars  # Vista tiempo real
├── public/
│   └── js/
│       └── realtime.js        # Cliente Socket.io
├── managers/
│   ├── ProductManager.js      # Gestión de productos
│   └── CartManager.js         # Gestión de carritos
└── data/
    ├── products.json          # Persistencia de productos
    └── carts.json             # Persistencia de carritos
```

## 🔧 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Handlebars** - Motor de plantillas
- **Socket.io** - Comunicación en tiempo real
- **File System** - Persistencia de datos

## 📚 Documentación Adicional

- `INSTRUCCIONES.md` - Guía de instalación y configuración
- `EJEMPLOS_API.md` - Ejemplos de uso de la API REST
- `ENTREGA_2_SOLUCION.md` - Documentación técnica de la Entrega 2

## 🎯 Funcionalidades en Tiempo Real

### Actualizaciones Automáticas
- Cuando se crea un producto (desde API o WebSocket), todos los clientes conectados reciben la actualización
- Cuando se elimina un producto, todos los clientes ven el cambio instantáneamente
- Los cambios desde la API REST se reflejan en las vistas web en tiempo real

### Comunicación Bidireccional
- Los clientes pueden enviar eventos directamente por WebSocket
- El servidor emite eventos a todos los clientes conectados
- Integración perfecta entre HTTP y WebSockets

## 📝 Notas

- Los archivos JSON se crean automáticamente si no existen
- Los IDs se autogeneran para evitar duplicados
- Las validaciones aseguran la integridad de los datos
- El servidor escucha en el puerto 8080 por defecto

## 👨‍💻 Autor

Proyecto desarrollado para CoderHouse - Programación Backend I