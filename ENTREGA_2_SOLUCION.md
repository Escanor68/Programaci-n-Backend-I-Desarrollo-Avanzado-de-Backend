# Entrega N° 2 - Solución Implementada

## 📋 Resumen de la Solución

Se ha implementado una solución completa que integra **Handlebars** como motor de plantillas y **Socket.io** para comunicación en tiempo real. La solución permite:

1. **Vista Home** (`/`) - Lista estática de productos
2. **Vista Tiempo Real** (`/realtimeproducts`) - Lista de productos que se actualiza automáticamente usando WebSockets
3. **Integración HTTP + WebSockets** - Los productos se pueden crear/eliminar tanto desde HTTP como desde WebSockets, y ambos métodos emiten eventos a todos los clientes conectados

## 🏗️ Arquitectura de la Solución

### 1. **Configuración del Servidor** (`src/app.js`)

La solución implementa **dos formas de comunicación**:

#### A. **HTTP + Socket.io (Recomendado)**
- Las rutas HTTP (`POST /api/products`, `DELETE /api/products/:pid`) emiten eventos de Socket.io
- Esto permite que las actualizaciones realizadas por API REST se reflejen en tiempo real en las vistas
- **Ventaja**: Mantiene la consistencia entre API REST y WebSockets

#### B. **WebSockets Directos**
- Los clientes pueden enviar eventos directamente por WebSocket (`addProduct`, `deleteProduct`)
- El servidor procesa estos eventos y emite actualizaciones a todos los clientes
- **Ventaja**: Comunicación bidireccional en tiempo real sin necesidad de recargar la página

### 2. **Estructura de Archivos**

```
src/
├── app.js                    # Servidor con Handlebars + Socket.io
├── routes/
│   ├── products.js          # Rutas API (con emisiones Socket.io)
│   ├── carts.js             # Rutas API de carritos
│   └── views.js             # Rutas de vistas (home, realtime)
├── views/
│   ├── layouts/
│   │   └── main.handlebars  # Layout principal
│   ├── home.handlebars      # Vista home
│   └── realTimeProducts.handlebars  # Vista tiempo real
├── public/
│   └── js/
│       └── realtime.js      # Cliente Socket.io
└── managers/
    └── ProductManager.js    # Gestión de productos
```

## 🔧 Componentes Clave

### **1. Configuración de Handlebars**

```javascript
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
```

### **2. Configuración de Socket.io**

```javascript
const httpServer = createServer(app);
const io = new Server(httpServer);

// Hacer disponible io en las rutas
app.set('io', io);
```

### **3. Emisión de Eventos desde HTTP**

En `src/routes/products.js`:

```javascript
// POST /api/products
router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(productData);
    
    // Obtener io y emitir evento
    const io = req.app.get('io');
    if (io) {
        const products = await productManager.getProducts();
        io.emit('productsUpdated', products);
        io.emit('productAdded', newProduct);
    }
    
    res.status(201).json({ ... });
});
```

### **4. Manejo de Eventos WebSocket**

En `src/app.js`:

```javascript
io.on('connection', (socket) => {
    // Manejar agregar producto desde WebSocket
    socket.on('addProduct', async (productData) => {
        const newProduct = await productManager.addProduct(productData);
        const products = await productManager.getProducts();
        
        // Emitir a todos los clientes
        io.emit('productsUpdated', products);
        io.emit('productAdded', newProduct);
    });
    
    // Manejar eliminar producto desde WebSocket
    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        const products = await productManager.getProducts();
        
        io.emit('productsUpdated', products);
        io.emit('productDeleted', productId);
    });
});
```

### **5. Cliente Socket.io** (`src/public/js/realtime.js`)

```javascript
const socket = io();

// Escuchar actualizaciones
socket.on('productsUpdated', (products) => {
    renderProducts(products);
});

// Enviar eventos
socket.emit('addProduct', productData);
socket.emit('deleteProduct', productId);
```

## 🚀 Flujo de Funcionamiento

### **Escenario 1: Crear producto desde la vista tiempo real**

1. Usuario completa el formulario en `/realtimeproducts`
2. Cliente envía evento `addProduct` por WebSocket
3. Servidor procesa y guarda el producto
4. Servidor emite `productsUpdated` y `productAdded` a **todos los clientes**
5. Todos los clientes conectados actualizan su vista automáticamente

### **Escenario 2: Crear producto desde API REST**

1. Cliente hace `POST /api/products` (desde Postman, otra app, etc.)
2. Servidor procesa y guarda el producto
3. Servidor emite eventos de Socket.io (`productsUpdated`, `productAdded`)
4. Todos los clientes conectados en `/realtimeproducts` actualizan su vista

### **Escenario 3: Eliminar producto**

- Funciona igual que crear, pero con eventos `deleteProduct` y `productDeleted`

## ✅ Ventajas de esta Solución

1. **Doble comunicación**: HTTP y WebSockets funcionan de forma integrada
2. **Tiempo real**: Todos los clientes ven los cambios instantáneamente
3. **Consistencia**: Los cambios desde API REST se reflejan en las vistas
4. **Flexibilidad**: Se puede usar desde formularios WebSocket o desde API REST
5. **Escalable**: Fácil de extender con más funcionalidades

## 📝 Instalación y Uso

1. **Instalar dependencias**:
```bash
npm install
```

2. **Iniciar servidor**:
```bash
npm start
# O en modo desarrollo:
npm run dev
```

3. **Acceder a las vistas**:
- Home: http://localhost:8080/
- Tiempo Real: http://localhost:8080/realtimeproducts

4. **Probar**:
- Abre múltiples pestañas en `/realtimeproducts`
- Crea o elimina un producto en una pestaña
- Observa cómo se actualiza automáticamente en todas las pestañas
- Prueba crear productos desde Postman (`POST /api/products`) y observa cómo se actualizan las vistas

## 🔍 Respuesta a la Pregunta del Enunciado

> **"¿Cómo utilizarás un emit dentro del POST?"**

**Respuesta**: Se utiliza `req.app.get('io')` para obtener la instancia de Socket.io desde la aplicación Express, y luego se emiten los eventos usando `io.emit()`. Esto permite que las operaciones HTTP (POST, DELETE) notifiquen a todos los clientes conectados por WebSocket sobre los cambios realizados.

```javascript
// En la ruta POST
const io = req.app.get('io');
if (io) {
    io.emit('productsUpdated', products);
}
```

Esta es la forma correcta de integrar Socket.io con Express, manteniendo ambas tecnologías funcionando de forma coordinada.
