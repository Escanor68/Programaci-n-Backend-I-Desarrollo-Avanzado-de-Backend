# 📖 Instrucciones de Instalación y Uso

## 🔧 Requisitos Previos

### Instalación de Node.js

Si no tienes Node.js instalado:

1. Ve a https://nodejs.org/
2. Descarga la versión **LTS** (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Reinicia tu terminal/PowerShell
5. Verifica la instalación:
```bash
node --version
npm --version
```

## 📦 Instalación del Proyecto

1. **Clonar o descargar el repositorio**

2. **Instalar dependencias**:
```bash
npm install
```

Esto instalará:
- `express` - Framework web
- `express-handlebars` - Motor de plantillas
- `socket.io` - Comunicación en tiempo real
- `mongoose` - ODM para MongoDB
- `nodemon` - Auto-reload en desarrollo (devDependency)

## 🗄️ Configuración de MongoDB

El proyecto está configurado para usar **MongoDB Atlas** (base de datos en la nube).

- La conexión se realiza automáticamente al iniciar el servidor
- La base de datos se crea automáticamente si no existe
- Puedes modificar la configuración en `src/config/config.js` si necesitas cambiar la URI o el nombre de la base de datos

## ▶️ Ejecución

### Modo Producción
```bash
npm start
```

### Modo Desarrollo (con auto-reload)
```bash
npm run dev
```

El servidor estará disponible en **http://localhost:8080**

## 🌐 Acceso a las Vistas

### Vista de Productos
- **URL**: http://localhost:8080/products
- Muestra la lista de productos con paginación
- Incluye filtros por categoría y disponibilidad
- Ordenamiento por precio (ascendente/descendente)
- Botones para ver detalles y agregar al carrito

### Vista de Detalle de Producto
- **URL**: http://localhost:8080/products/:pid
- Muestra información completa del producto
- Botón para agregar al carrito

### Vista de Carrito
- **URL**: http://localhost:8080/carts/:cid
- Muestra los productos del carrito con información completa
- Permite actualizar cantidades
- Permite eliminar productos
- Botón para vaciar el carrito

### Vista Tiempo Real
- **URL**: http://localhost:8080/realtimeproducts
- Muestra la lista de productos con actualizaciones en tiempo real
- Incluye formulario para agregar productos
- Botones para eliminar productos
- Se actualiza automáticamente cuando otros usuarios realizan cambios

## 📡 Uso de la API REST

### Con Postman o similar

#### Crear un producto:
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

#### Obtener productos con paginación y filtros:
```
GET http://localhost:8080/api/products?limit=5&page=1&sort=asc&query=Electrónicos
```

#### Crear un carrito:
```
POST http://localhost:8080/api/carts
```

#### Agregar producto al carrito:
```
POST http://localhost:8080/api/carts/{cartId}/product/{productId}
```

Ver `EJEMPLOS_API.md` para más ejemplos completos.

## 🎯 Probar Funcionalidades

### 1. Paginación de Productos
1. Abre `http://localhost:8080/products`
2. Usa los filtros para buscar por categoría o disponibilidad
3. Cambia el ordenamiento por precio
4. Navega entre páginas usando los botones de paginación

### 2. Agregar Productos al Carrito
1. En la vista de productos, haz clic en "Agregar al Carrito"
2. O ve al detalle del producto y agrega desde ahí
3. El carrito se guarda en localStorage del navegador

### 3. Gestionar Carrito
1. Accede a la vista del carrito usando el ID guardado
2. Actualiza las cantidades directamente
3. Elimina productos individuales
4. Vacía el carrito completo

### 4. Tiempo Real
1. Abre múltiples pestañas en `/realtimeproducts`
2. Crea o elimina un producto en una pestaña
3. Observa cómo se actualiza automáticamente en todas las pestañas

## 📁 Estructura del Proyecto

```
src/
├── app.js                      # Servidor principal
├── config/
│   ├── config.js              # Configuración centralizada
│   ├── database.js            # Configuración MongoDB
│   └── handlebars-helpers.js  # Helpers de Handlebars
├── controllers/                # Controladores (peticiones HTTP)
│   ├── ProductController.js
│   ├── CartController.js
│   └── ViewController.js
├── services/                   # Servicios (lógica de negocio)
│   ├── ProductService.js
│   └── CartService.js
├── repositories/               # Repositorios (acceso a datos)
│   ├── ProductRepository.js
│   └── CartRepository.js
├── models/                     # Modelos Mongoose
│   ├── Product.js
│   └── Cart.js
├── middlewares/                # Middlewares de Express
│   ├── logger.middleware.js
│   ├── errorHandler.middleware.js
│   ├── notFoundHandler.middleware.js
│   ├── validators.middleware.js
│   ├── productValidator.middleware.js
│   └── index.js
├── sockets/                    # Configuración Socket.io
│   ├── socketHandlers.js
│   └── index.js
├── routes/                     # Definición de rutas
│   ├── products.js
│   ├── carts.js
│   └── views.js
├── views/                      # Vistas Handlebars
│   ├── layouts/
│   │   └── main.handlebars
│   ├── products.handlebars
│   ├── productDetail.handlebars
│   ├── cart.handlebars
│   ├── error.handlebars
│   └── realTimeProducts.handlebars
└── public/
    └── js/
        └── realtime.js
```

## 🔍 Endpoints Disponibles

### Vistas Web
- `GET /` - Redirige a /products
- `GET /products` - Vista de productos con paginación
- `GET /products/:pid` - Vista de detalle de producto
- `GET /carts/:cid` - Vista de carrito específico
- `GET /realtimeproducts` - Vista tiempo real

### API - Productos (`/api/products/`)
- `GET /` - Listar productos (con paginación, filtros y ordenamiento)
- `GET /:pid` - Obtener producto por ID
- `POST /` - Crear nuevo producto
- `PUT /:pid` - Actualizar producto
- `DELETE /:pid` - Eliminar producto

### API - Carritos (`/api/carts/`)
- `POST /` - Crear nuevo carrito
- `GET /:cid` - Listar productos del carrito (con populate)
- `POST /:cid/product/:pid` - Agregar producto al carrito
- `PUT /:cid/products/:pid` - Actualizar cantidad de producto
- `PUT /:cid` - Actualizar todos los productos del carrito
- `DELETE /:cid/products/:pid` - Eliminar producto del carrito
- `DELETE /:cid` - Vaciar carrito

## ⚙️ Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon (auto-reload)

## 🐛 Solución de Problemas

### Error: "Cannot find module"
- Ejecuta `npm install` para instalar las dependencias

### Error: "Port 8080 already in use"
- Cierra otros procesos que usen el puerto 8080
- O cambia el puerto en `src/config/config.js` (variable `port`)

### Error de conexión a MongoDB
- Verifica tu conexión a internet
- Revisa que la URI de MongoDB en `src/config/config.js` sea correcta
- La conexión a MongoDB Atlas es automática si está configurada
- Revisa los logs del servidor para más detalles
- Si no tienes `.env`, el proyecto usará valores por defecto

### Las vistas no se actualizan
- Verifica que Socket.io esté funcionando (revisa la consola del navegador)
- Asegúrate de estar en la ruta correcta

### Los productos no se muestran
- Verifica que MongoDB esté conectado
- Revisa la consola del servidor para errores
- Asegúrate de haber creado productos primero

## 🏛️ Arquitectura del Proyecto

El proyecto sigue una **arquitectura en capas** (Layered Architecture):

1. **Controllers**: Manejan las peticiones HTTP y respuestas
2. **Services**: Contienen la lógica de negocio
3. **Repositories**: Gestionan el acceso a la base de datos
4. **Models**: Definen los esquemas de datos con Mongoose
5. **Middlewares**: Manejan validaciones, logging, errores y rutas no encontradas
6. **Sockets**: Configuración y handlers de Socket.io para tiempo real

Esta arquitectura permite:
- Separación clara de responsabilidades
- Código más mantenible y escalable
- Facilidad para realizar pruebas
- Reutilización de código
- Validaciones centralizadas
- Configuración modular

## 📚 Documentación Adicional

- `README.md` - Documentación general del proyecto
- `COMANDOS_PRUEBA.md` - Comandos para probar el proyecto

## 💡 Tips

- Usa `npm run dev` durante el desarrollo para auto-reload
- Abre la consola del navegador (F12) para ver los eventos de Socket.io
- Los productos se guardan en MongoDB automáticamente
- Los cambios se reflejan en tiempo real en todas las vistas conectadas
- Las validaciones de productos se realizan automáticamente mediante middlewares
- Revisa los logs del servidor para ver todas las peticiones HTTP
- Puedes modificar la configuración en `src/config/config.js` si necesitas cambiar puerto, MongoDB, etc.