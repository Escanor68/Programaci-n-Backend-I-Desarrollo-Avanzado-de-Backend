# Backend API - Productos y Carritos

## 📋 Descripción
API desarrollada con Node.js y Express para la gestión de productos y carritos de compra, con integración de Handlebars para vistas, Socket.io para actualizaciones en tiempo real y MongoDB como base de datos.

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una **arquitectura en capas** (Layered Architecture) para mantener el código organizado y escalable:

- **Controllers**: Manejan las peticiones HTTP y respuestas
- **Services**: Contienen la lógica de negocio
- **Repositories**: Gestionan el acceso a la base de datos
- **Models**: Definen los esquemas de datos con Mongoose
- **Routes**: Definen los endpoints de la API
- **Middlewares**: Manejan validaciones, logging, errores y rutas no encontradas

## 🚀 Características

### Entrega N° 1
- ✅ API REST completa para productos y carritos
- ✅ Persistencia en archivos JSON
- ✅ Validaciones y manejo de errores

### Entrega N° 2
- ✅ Motor de plantillas Handlebars
- ✅ Vistas web con diseño moderno
- ✅ Socket.io para actualizaciones en tiempo real
- ✅ Integración HTTP + WebSockets

### Entrega Final
- ✅ Migración a MongoDB con Mongoose
- ✅ Paginación, filtros y ordenamiento de productos
- ✅ Arquitectura en capas (Controllers, Services, Repositories, Middlewares)
- ✅ Vistas con paginación y detalle de productos
- ✅ Vista de carrito con populate de productos
- ✅ Nuevos endpoints de carritos
- ✅ Middlewares para validaciones y manejo de errores
- ✅ Socket.io modularizado en carpeta separada

### Mejoras Adicionales
- ✅ Variables de entorno con dotenv
- ✅ Configuración centralizada
- ✅ Validaciones robustas de productos
- ✅ CORS configurado para Socket.io

## 📦 Instalación

1. **Instalar Node.js** desde https://nodejs.org/ (versión LTS recomendada)

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar Variables de Entorno**:
   - Copiar `.env.example` a `.env`
   - Completar con tus valores de MongoDB y configuración
   - Ver `MEJORAS_IMPLEMENTADAS.md` para más detalles

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

### Productos
- **URL**: `http://localhost:8080/products`
- Lista de productos con paginación
- Filtros por categoría y disponibilidad
- Ordenamiento por precio (asc/desc)
- Botones para ver detalles y agregar al carrito

### Detalle de Producto
- **URL**: `http://localhost:8080/products/:pid`
- Vista detallada del producto
- Botón para agregar al carrito

### Carrito
- **URL**: `http://localhost:8080/carts/:cid`
- Lista de productos del carrito con información completa
- Actualización de cantidades
- Eliminación de productos

### Productos en Tiempo Real
- **URL**: `http://localhost:8080/realtimeproducts`
- Lista de productos con actualizaciones en tiempo real
- Formulario para agregar productos
- Botones para eliminar productos

## 📡 Endpoints API

### Productos (`/api/products/`)

#### GET `/api/products`
Lista productos con paginación, filtros y ordenamiento.

**Query Parameters:**
- `limit` (opcional): Número de productos por página (default: 10)
- `page` (opcional): Número de página (default: 1)
- `sort` (opcional): Ordenamiento por precio (`asc` o `desc`)
- `query` (opcional): Filtro por categoría o `available` para productos disponibles

**Ejemplo:**
```
GET /api/products?limit=5&page=1&sort=asc&query=Electrónicos
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 3,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?limit=5&page=2&sort=asc&query=Electrónicos"
}
```

#### GET `/api/products/:pid`
Obtiene un producto por ID.

#### POST `/api/products`
Crea un nuevo producto.

#### PUT `/api/products/:pid`
Actualiza un producto.

#### DELETE `/api/products/:pid`
Elimina un producto.

### Carritos (`/api/carts/`)

#### POST `/api/carts`
Crea un nuevo carrito.

#### GET `/api/carts/:cid`
Obtiene un carrito con productos completos (populate).

#### POST `/api/carts/:cid/product/:pid`
Agrega un producto al carrito.

#### PUT `/api/carts/:cid/products/:pid`
Actualiza SOLO la cantidad de un producto en el carrito.

#### PUT `/api/carts/:cid`
Actualiza todos los productos del carrito con un arreglo.

#### DELETE `/api/carts/:cid/products/:pid`
Elimina un producto del carrito.

#### DELETE `/api/carts/:cid`
Elimina todos los productos del carrito.

## 🏗️ Estructura del Proyecto

```
src/
├── app.js                      # Servidor principal
├── config/
│   ├── config.js              # Configuración centralizada
│   ├── database.js            # Configuración MongoDB
│   └── handlebars-helpers.js  # Helpers de Handlebars
├── controllers/                # Capa de controladores
│   ├── ProductController.js
│   ├── CartController.js
│   └── ViewController.js
├── services/                   # Capa de servicios (lógica de negocio)
│   ├── ProductService.js
│   └── CartService.js
├── repositories/               # Capa de repositorios (acceso a datos)
│   ├── ProductRepository.js
│   └── CartRepository.js
├── models/                     # Modelos de Mongoose
│   ├── Product.js
│   └── Cart.js
├── routes/                     # Definición de rutas
│   ├── products.js
│   ├── carts.js
│   └── views.js
├── middlewares/                # Middlewares de Express
│   ├── logger.middleware.js
│   ├── errorHandler.middleware.js
│   ├── notFoundHandler.middleware.js
│   ├── validators.middleware.js
│   ├── productValidator.middleware.js
│   └── index.js
├── sockets/                    # Configuración de Socket.io
│   ├── socketHandlers.js
│   └── index.js
├── views/                      # Vistas Handlebars
│   ├── layouts/
│   │   └── main.handlebars
│   ├── products.handlebars
│   ├── productDetail.handlebars
│   ├── cart.handlebars
│   └── realTimeProducts.handlebars
└── public/
    └── js/
        └── realtime.js
```

## 🔧 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Handlebars** - Motor de plantillas
- **Socket.io** - Comunicación en tiempo real

## 📚 Documentación Adicional

- `INSTRUCCIONES.md` - Guía de instalación y configuración
- `EJEMPLOS_API.md` - Ejemplos de uso de la API REST
- `ENTREGA_2_SOLUCION.md` - Documentación técnica de la Entrega 2
- `MEJORAS_IMPLEMENTADAS.md` - Documentación de mejoras adicionales

## 🎯 Funcionalidades en Tiempo Real

### Actualizaciones Automáticas
- Cuando se crea un producto (desde API o WebSocket), todos los clientes conectados reciben la actualización
- Cuando se elimina un producto, todos los clientes ven el cambio instantáneamente
- Los cambios desde la API REST se reflejan en las vistas web en tiempo real

### Comunicación Bidireccional
- Los clientes pueden enviar eventos directamente por WebSocket
- El servidor emite eventos a todos los clientes conectados
- Integración perfecta entre HTTP y WebSockets

## 🏛️ Arquitectura en Capas

### Controllers
Manejan las peticiones HTTP, validan los datos de entrada y formatean las respuestas.

### Services
Contienen la lógica de negocio, validaciones y orquestación de operaciones.

### Repositories
Gestionan el acceso a la base de datos, abstraen las operaciones de MongoDB.

### Middlewares
Manejan validaciones, logging, manejo de errores y rutas no encontradas:
- **Logger**: Registra todas las peticiones HTTP
- **ErrorHandler**: Maneja errores no controlados
- **NotFoundHandler**: Maneja rutas no encontradas (404)
- **Validators**: Valida ObjectIds, campos requeridos, arrays y números positivos

### Ventajas de esta Arquitectura
- ✅ Separación de responsabilidades
- ✅ Código más mantenible y escalable
- ✅ Fácil de testear
- ✅ Reutilización de código
- ✅ Facilita cambios en la base de datos sin afectar la lógica de negocio

## 📝 Notas

- **Variables de entorno**: Usa `.env` para configuración (ver `.env.example`)
- MongoDB Atlas se conecta automáticamente al iniciar el servidor
- Los IDs son ObjectIds de MongoDB
- Las validaciones se realizan mediante middlewares antes de llegar a los controllers
- El servidor escucha en el puerto 8080 por defecto (configurable en `.env`)
- Los middlewares validan ObjectIds, campos requeridos, tipos de datos y productos completos
- Socket.io está modularizado en `src/sockets/` para mejor organización

## 👨‍💻 Autor

Proyecto desarrollado para CoderHouse - Programación Backend I