# 🏡 Cabañas Los Manzanos - Sistema de Gestión de Reservas

Sistema de gestión de reservas desarrollado con Next.js para las Cabañas Los Manzanos en San Martín de los Andes, Neuquén.

## 🚀 Tecnologías

-   **Next.js 16** (App Router)
-   **TypeScript**
-   **Tailwind CSS 4**
-   **shadcn/ui** - Componentes de UI
-   **MongoDB** con Mongoose
-   **React Hook Form** + Zod - Validación de formularios
-   **Nodemailer** - Envío de emails
-   **date-fns** - Manejo de fechas

## 📋 Características

-   ✅ Formulario elegante de creación de reservas
-   ✅ Validación de datos en tiempo real
-   ✅ Cálculo automático de saldo pendiente
-   ✅ Cálculo automático de cantidad de días
-   ✅ Envío automático de email de confirmación
-   ✅ Diseño responsive y moderno
-   🔄 Próximamente: Integración con n8n para actualización de Excel

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio (si aplica)

```bash
git clone <url-del-repo>
cd manzanos-cabins
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Creá un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/manzanos-cabins

# Email Configuration (ejemplo con Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-password-de-app-de-gmail
EMAIL_FROM=tu-email@gmail.com
EMAIL_TO=email-destino@gmail.com
```

#### Configuración de Gmail para envío de emails:

1. Ir a tu cuenta de Google
2. Habilitar la verificación en 2 pasos
3. Generar una "Contraseña de aplicación"
4. Usar esa contraseña en `EMAIL_PASSWORD`

### 4. Asegurate de tener MongoDB corriendo

**Local:**

```bash
mongod
```

**O usar MongoDB Atlas** (recomendado para producción)

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3001](http://localhost:3001)

## 📝 Uso

### Crear una reserva

1. Acceder a la página principal
2. Completar el formulario con los datos del huésped:
    - Nombre y apellido
    - Origen de la reserva (Booking, Airbnb, Particular, Otro)
    - Fechas de entrada y salida
    - Costo total
    - Seña recibida
3. Hacer clic en "Crear Reserva"
4. El sistema calculará automáticamente:
    - Saldo pendiente
    - Cantidad de días
5. Se enviará un email automático con los detalles

### API Endpoints

#### POST /api/reservas

Crear una nueva reserva.

```json
{
    "nombreCompleto": "Juan Pérez",
    "origenReserva": "Booking",
    "fechaInicio": "2026-02-01",
    "fechaFin": "2026-02-05",
    "costoTotal": 100000,
    "sena": 30000
}
```

#### GET /api/reservas

Obtener todas las reservas (con paginación).

Query params:

-   `page`: número de página (default: 1)
-   `limit`: resultados por página (default: 50)

## 🎨 Personalización

Los colores y estilos se pueden modificar en:

-   `app/globals.css` - Variables de colores
-   `components/forms/ReservaForm.tsx` - Formulario
-   `app/page.tsx` - Página principal

## 📧 Integración con n8n (Próximamente)

El sistema está preparado para integrar con n8n mediante webhooks:

1. Crear un flujo en n8n que escuche el endpoint de reservas
2. Configurar la actualización automática de Excel
3. Agregar conversión de moneda (pesos a dólares)

## 🚢 Deployment

### Vercel (Recomendado)

1. Conectar el repositorio con Vercel
2. Configurar las variables de entorno
3. Deploy automático

### Otros servicios

El proyecto es compatible con cualquier plataforma que soporte Next.js:

-   Railway
-   Render
-   AWS
-   Digital Ocean

## 📄 Estructura del Proyecto

```
manzanos-cabins/
├── app/
│   ├── api/
│   │   └── reservas/
│   │       └── route.ts          # API de reservas
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página principal
├── components/
│   ├── forms/
│   │   └── ReservaForm.tsx       # Formulario de reservas
│   └── ui/                       # Componentes de shadcn/ui
├── lib/
│   ├── email.ts                  # Utilidad de envío de emails
│   ├── mongodb.ts                # Conexión a MongoDB
│   ├── schemas.ts                # Schemas de validación Zod
│   └── utils.ts                  # Utilidades generales
├── models/
│   └── Reserva.ts                # Modelo de Mongoose
└── package.json
```

## 👩‍💻 Desarrollo

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 3001)
npm run build    # Build para producción
npm run start    # Servidor de producción (puerto 3001)
npm run lint     # Linter
```

## 🐛 Troubleshooting

### Error: Cannot connect to MongoDB

-   Verificar que MongoDB esté corriendo
-   Revisar la URI en `.env.local`

### Error: No se envían los emails

-   Verificar la configuración de email en `.env.local`
-   Si usás Gmail, asegurarte de tener una contraseña de aplicación
-   Revisar los logs en la consola

### Puerto 3001 ya en uso

-   Cambiar el puerto en `package.json`:
    ```json
    "dev": "next dev -p OTRO_PUERTO"
    ```

## 📞 Soporte

Para consultas o problemas, contactar a [tu-email@ejemplo.com]

---

Desarrollado con ❤️ para Cabañas Los Manzanos
