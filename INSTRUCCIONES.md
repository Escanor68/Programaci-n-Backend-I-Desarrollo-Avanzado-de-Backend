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
- `nodemon` - Auto-reload en desarrollo (devDependency)

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

### Vista Home
- **URL**: http://localhost:8080/
- Muestra la lista completa de productos
- Vista estática (se actualiza al recargar la página)

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

#### Crear un carrito:
```
POST http://localhost:8080/api/carts
```

#### Agregar producto al carrito:
```
POST http://localhost:8080/api/carts/1/product/1
```

Ver `EJEMPLOS_API.md` para más ejemplos completos.

## 🎯 Probar Funcionalidades en Tiempo Real

1. **Abrir múltiples pestañas**:
   - Abre `http://localhost:8080/realtimeproducts` en 2-3 pestañas diferentes

2. **Crear un producto**:
   - En una pestaña, completa el formulario y haz clic en "Agregar Producto"
   - Observa cómo se actualiza automáticamente en todas las pestañas

3. **Eliminar un producto**:
   - En una pestaña, haz clic en "Eliminar" en cualquier producto
   - Observa cómo desaparece en todas las pestañas

4. **Probar desde API REST**:
   - Usa Postman para crear un producto con `POST /api/products`
   - Observa cómo se actualiza automáticamente en las vistas web

## 📁 Estructura del Proyecto

```
src/
├── app.js                      # Servidor principal
├── routes/
│   ├── products.js            # Rutas API de productos
│   ├── carts.js               # Rutas API de carritos
│   └── views.js               # Rutas de vistas web
├── views/
│   ├── layouts/
│   │   └── main.handlebars    # Layout principal con estilos
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

## 🔍 Endpoints Disponibles

### Vistas Web
- `GET /` - Vista home
- `GET /realtimeproducts` - Vista tiempo real

### API - Productos (`/api/products/`)
- `GET /` - Listar todos los productos
- `GET /:pid` - Obtener producto por ID
- `POST /` - Crear nuevo producto
- `PUT /:pid` - Actualizar producto
- `DELETE /:pid` - Eliminar producto

### API - Carritos (`/api/carts/`)
- `POST /` - Crear nuevo carrito
- `GET /:cid` - Listar productos del carrito
- `POST /:cid/product/:pid` - Agregar producto al carrito
- `PUT /:cid/product/:pid` - Actualizar cantidad de producto
- `DELETE /:cid/product/:pid` - Eliminar producto del carrito
- `DELETE /:cid` - Vaciar carrito

## ⚙️ Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon (auto-reload)

## 🐛 Solución de Problemas

### Error: "Cannot find module"
- Ejecuta `npm install` para instalar las dependencias

### Error: "Port 8080 already in use"
- Cierra otros procesos que usen el puerto 8080
- O cambia el puerto en `src/app.js`

### Las vistas no se actualizan
- Verifica que Socket.io esté funcionando (revisa la consola del navegador)
- Asegúrate de estar en la ruta `/realtimeproducts`

### Los archivos JSON no se crean
- Verifica que la carpeta `src/data/` exista
- Verifica los permisos de escritura en el directorio

## 📚 Documentación Adicional

- `README.md` - Documentación general del proyecto
- `EJEMPLOS_API.md` - Ejemplos detallados de uso de la API
- `ENTREGA_2_SOLUCION.md` - Documentación técnica de WebSockets y Handlebars

## 💡 Tips

- Usa `npm run dev` durante el desarrollo para auto-reload
- Abre la consola del navegador (F12) para ver los eventos de Socket.io
- Los productos de ejemplo están en `src/data/products.json`
- Los cambios se guardan automáticamente en los archivos JSON