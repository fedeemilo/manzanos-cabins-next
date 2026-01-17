# Changelog

Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.5.0] - 2026-01-17 🎨

### ✨ Added - Nuevos Íconos y Mejoras Open Graph

#### Íconos Actualizados

-   **Nuevo diseño**: Cabañita con montaña de fondo (de Flaticon)
-   **Favicon**: Actualizado `favicon.ico` en `app/` y `public/`
-   **PWA Icons**: Reemplazados `icon-192.png` y `icon-512.png`
-   **Apple Touch Icon**: Agregado `apple-touch-icon.png` para iOS
-   **Manifest**: Actualizado con referencia al nuevo ícono de Apple

#### Open Graph Mejorado

-   **URL absoluta**: Open Graph ahora usa URL completa para imágenes
-   **Soporte multi-entorno**: Usa `NEXT_PUBLIC_URL` o fallback a producción
-   **Preview en WhatsApp**: Imagen de cabañas (`cabin-preview.png`) ahora se muestra correctamente

**Antes:**
```typescript
url: '/cabin-preview.png'  // ❌ URL relativa, no funciona en WhatsApp
```

**Después:**
```typescript
const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://cabanas-manzanos.vercel.app'
url: `${baseUrl}/cabin-preview.png`  // ✅ URL absoluta
```

### 🗑️ Removed - Acortador de URLs

-   **Removida función `acortarURL()`**: Links ahora se envían completos
-   **Causa**: Preferencia del usuario por simplicidad
-   **Impacto**: Links en WhatsApp serán más largos pero más confiables

**Antes:**
```
https://is.gd/abc123
```

**Después:**
```
https://cabanas-manzanos.vercel.app/reserva/696bb8123066dcb8d4e3bf86
```

### 🔧 Changed

-   **`app/reserva/[id]/layout.tsx`**: 
    -   URL de Open Graph ahora es absoluta
    -   Removido parámetro `id` no utilizado
-   **`lib/utils.ts`**: Removida función `acortarURL()`
-   **`components/shared/SuccessBanner.tsx`**: Links sin acortar
-   **`components/shared/UltimasReservas.tsx`**: Links sin acortar
-   **`public/manifest.json`**: Agregado `apple-touch-icon.png`
-   **`app/layout.tsx`**: Vinculado `apple-touch-icon.png` en metadata

### 🎯 Íconos Incluidos

```
public/
  ├── favicon.ico          (nuevo diseño)
  ├── icon-192.png         (PWA - Android)
  ├── icon-512.png         (PWA - Android)
  ├── apple-touch-icon.png (PWA - iOS)
  └── cabin-preview.png    (Open Graph)

app/
  └── favicon.ico          (copia para Next.js 16)
```

---

## [1.4.1] - 2026-01-17 🔒

### 🐛 Fixed - Seguridad en Página Pública

#### Navbar Oculto en Rutas Públicas

-   **Problema**: El Navbar con navegación (Nueva Reserva, Gestión) era visible en páginas públicas
-   **Impacto**: Clientes podían ver links a áreas administrativas (aunque sin acceso)
-   **Solución**: Movido Navbar dentro de AuthGuard con renderizado condicional

**Causa**: El Navbar estaba en `app/layout.tsx` fuera del control de rutas públicas, renderizándose siempre.

**Solución**: 
- Movido `Navbar` de `layout.tsx` a `AuthGuard.tsx`
- Renderizado condicional: `{!isPublicRoute && <Navbar />}`
- Solo usuarios autenticados ven navegación

**Antes:**
```tsx
// app/layout.tsx
<AuthGuard>
    <Navbar />  {/* Siempre visible */}
    {children}
</AuthGuard>
```

**Después:**
```tsx
// components/auth/AuthGuard.tsx
return (
    <>
        {!isPublicRoute && <Navbar />}  {/* Solo en rutas privadas */}
        {children}
        {!isPublicRoute && <FloatingButtons />}
    </>
)
```

#### Mensajes WhatsApp sin Emojis

-   **Problema**: Emojis (👋 🏡 🏔️) se convertían en caracteres especiales (◆) en WhatsApp
-   **Causa**: Problemas de encoding UTF-8 en URLs de WhatsApp
-   **Solución**: Removidos todos los emojis y caracteres especiales de mensajes

**Antes:**
```
Hola Juan! 👋
Te confirmamos... *Cabañas Los Manzanos*. 🏡
¡Te esperamos... Andes! 🏔️
```

**Después:**
```
Hola Juan!
Te confirmamos... Cabañas Los Manzanos.
Te esperamos... Andes!
```

### 🎯 Mejoras de Seguridad

-   **Navbar**: No visible en `/reserva/[id]`
-   **Botones flotantes**: No visibles en rutas públicas
-   **Separación clara**: UI administrativa vs. UI pública

### 🔧 Changed

-   **`app/layout.tsx`**: Removido import y renderizado de `Navbar`
-   **`components/auth/AuthGuard.tsx`**: 
    -   Agregado import de `Navbar`
    -   Renderizado condicional de `Navbar` basado en `isPublicRoute`
-   **`components/shared/SuccessBanner.tsx`**: Mensaje WhatsApp sin emojis
-   **`components/shared/UltimasReservas.tsx`**: Mensaje WhatsApp sin emojis
-   **`.cursorrules`**: 
    -   Agregada sección de Interactividad con regla `cursor-pointer`
    -   Actualizada sección de Sistema de Notificaciones (Email → WhatsApp)
    -   Actualizada estructura de archivos y funcionalidad core

---

## [1.4.0] - 2026-01-17 📱

### ✨ Added - Sistema de WhatsApp y Página Pública de Reservas

#### Reemplazo de Email por WhatsApp

-   **Campo teléfono**: Input opcional en formulario de reserva (solo números)
-   **Validación de teléfono**: Regex en Zod para asegurar solo números
-   **Botón WhatsApp en SuccessBanner**: Envía mensaje preformateado al cliente
-   **Botón WhatsApp en UltimasReservas**: Ícono sutil con tooltip para reenviar confirmación
-   **Mensaje personalizado**: Saluda por nombre + link a página pública de reserva
-   **Almacenamiento en BD**: Campo `telefono` en modelo Mongoose

#### Página Pública de Reserva (`/reserva/[id]`)

-   **Vista pública**: No requiere autenticación
-   **Diseño elegante**: Card con toda la información de la reserva
-   **Responsive**: Se adapta perfectamente a mobile
-   **Información completa**:
    -   Datos del huésped (nombre, teléfono)
    -   Detalles de estadía (cabaña, fechas, días)
    -   Información financiera (ARS, USD, cotización, seña, saldo)
    -   Estado de pago
-   **Branding**: Header y footer con nombre y ubicación de las cabañas
-   **API pública**: Endpoint `GET /api/reservas/public/[id]` para obtener datos

#### Mejoras de UX

-   **Botón "Nueva Reserva"**: En SuccessBanner para workflow ágil
-   **Formato USD argentino**: `$1.122` en vez de `$1,122` para familiaridad local
-   **AuthGuard mejorado**: Excluye rutas públicas (`/reserva/[id]`) de autenticación
-   **Botones flotantes ocultos**: No se muestran en páginas públicas

### 🗑️ Removed

-   **Sistema de emails**: Eliminado `lib/email.ts` y todas las referencias
-   **Nodemailer**: Ya no se usa
-   **Variables de entorno EMAIL_***: Ya no son necesarias

### 🔧 Changed

-   **`lib/schemas.ts`**: Agregado campo `telefono` (opcional, solo números)
-   **`models/Reserva.ts`**: Agregado campo `telefono` (String, optional)
-   **`app/api/reservas/route.ts`**: 
    -   Removido import de `enviarEmailReserva`
    -   Agregado guardado de `telefono`
-   **`components/shared/SuccessBanner.tsx`**:
    -   Agregado prop `telefono` y `_id`
    -   Botón WhatsApp condicional (solo si hay teléfono)
    -   Función `enviarWhatsApp()` con mensaje preformateado
-   **`components/shared/UltimasReservas.tsx`**:
    -   Agregado botón WhatsApp junto a "Marcar Pagado"
    -   Solo visible si la reserva tiene teléfono
-   **`components/forms/ReservaForm.tsx`**:
    -   Agregado input de teléfono con validación inline
    -   Pasado `_id` y `telefono` a `SuccessBanner`
-   **`components/auth/AuthGuard.tsx`**:
    -   Agregado `usePathname` de Next.js
    -   Array `publicRoutes` para excepciones
    -   Lógica para bypass de autenticación en rutas públicas
    -   Ocultación de botones flotantes en rutas públicas

### 🎯 Beneficios

**Antes (Email):**
- ❌ Configuración compleja de SMTP
- ❌ Timeouts en Vercel
- ❌ Posibles problemas de deliverability
- ❌ Cliente no puede ver link interactivo fácilmente

**Después (WhatsApp):**
- ✅ No requiere configuración de servidor
- ✅ Comunicación directa con el cliente
- ✅ Link clickeable en app de mensajería
- ✅ Cliente puede guardar conversación
- ✅ Mayor tasa de apertura/lectura

**Causa**: El sistema de emails presentaba problemas de timeout en Vercel, configuración compleja y poca visibilidad para los clientes. WhatsApp es más directo, familiar y confiable.

**Solución**: Sistema de notificación por WhatsApp con link a página pública de reserva.

---

## [1.3.0] - 2026-01-15 ⚠️

### ✨ Added - Modal de Confirmación y Mejoras

#### Modal de Confirmación de Logout

-   **Modal AlertDialog**: Confirmación antes de cerrar sesión para prevenir errores accidentales
-   **Integración shadcn/ui**: Componente `alert-dialog` con animaciones suaves
-   **Diseño claro**:
    -   Overlay oscuro semi-transparente
    -   Card centrado con zoom-in animation
    -   Botón rojo con texto blanco para acción destructiva
    -   Botón outline para cancelar
-   **Prevención de errores**: Requiere doble confirmación para cerrar sesión
-   **UX mejorada**: Click fuera del modal o ESC para cancelar

**Causa**: Usuario puede cerrar sesión sin querer con un solo click, generando fricción innecesaria.

**Solución**: Modal de confirmación que requiere acción explícita para logout.

**Antes:**

```tsx
<Button onClick={handleLogout}>Cerrar Sesión</Button>
```

**Después:**

```tsx
<AlertDialog>
    <AlertDialogTrigger asChild>
        <Button>Cerrar Sesión</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
                ¿Estás seguro que querés cerrar sesión?...
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Cerrar Sesión</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
```

#### Favicon ICO

-   **Formato ICO**: Conversión de PNG a `.ico` para mejor compatibilidad cross-browser
-   **Reemplazo de SVG**: El favicon SVG no se mostraba correctamente en algunos navegadores
-   **Metadata actualizada**: `app/layout.tsx` apunta a `favicon.ico`

**Causa**: El `favicon.svg` no se renderizaba en todos los browsers.

**Solución**: Conversión del `icon-192.png` a `favicon.ico` (formato más universal).

### 🗑️ Removed

-   **favicon.svg**: Eliminado por incompatibilidad

### 📦 Dependencies

-   **Added**: `@radix-ui/react-alert-dialog@^1.1.4` - Para modal de confirmación

---

## [1.2.0] - 2026-01-15 🔐

### ✨ Added - Sistema de Autenticación y Mejoras UX

#### Sistema de Autenticación

-   **Login completo**: Pantalla de login con usuario y contraseña
-   **Credenciales en .env**: `AUTH_USERNAME` y `AUTH_PASSWORD` configurables
-   **Sesión persistente**: localStorage con expiración de 7 días
-   **AuthGuard**: Componente que protege toda la aplicación
-   **API Route**: `/api/auth/login` valida credenciales server-side
-   **Token hasheado**: SHA256 para seguridad básica
-   **Botón de logout**: Flotante en esquina inferior derecha
-   **Toast feedback**: Mensajes de éxito para login y logout
-   **Auto-verificación**: Chequea sesión al cargar la app

#### Validaciones y UX Mejorada

-   **Validación de fechas**: Limpia automáticamente fecha fin si fecha inicio > fecha fin
-   **UX inputs numéricos**: Limpia `0` al hacer foco, restaura al salir vacío (Seña y Descuento)
-   **Total destacado**: Fondos prominentes y texto grande para el monto total de reserva
    -   Con descuento: Fondo amber-600, texto blanco, text-2xl
    -   Sin descuento: Degradado stone-700/800, texto blanco, text-3xl
-   **Banner de éxito**: Información completa de reserva creada con link a Gestión

#### Navegación y Estructura

-   **Navbar sticky**: Navegación persistente entre Home y Gestión
-   **Nueva página /gestion**: Administración de reservas y ocupación de cabañas
-   **DolarDisplay compacto**: Reducido 40% e integrado en navbar (esquina derecha)
-   **Separación de responsabilidades**: Formulario en Home, administración en /gestion

#### Responsive

-   **Grid del formulario**: Detección de viewport (useEffect + useState) para layout correcto
    -   Desktop (≥1024px): Formulario y resumen lado a lado (2fr + 1fr)
    -   Mobile (<1024px): Apilado verticalmente
-   **DolarDisplay responsive**: Mejor posicionamiento y escalado adaptativo

### 🔒 Security

-   Credenciales protegidas en variables de entorno
-   Validación server-side de autenticación
-   Token hasheado con SHA256
-   Expiración automática de sesión
-   Toda la app protegida con AuthGuard

---

## [1.1.0] - 2026-01-15 🎨

### ✨ Added - Navegación y Mejoras Responsive

#### Navegación

-   **Navbar persistente**: Barra de navegación sticky con Next.js Link
-   **Páginas separadas**:
    -   `/` - Home: Formulario de nueva reserva
    -   `/gestion` - Gestión: Últimas reservas + Ocupación de cabañas
-   **Indicador de ruta activa**: Visual feedback de página actual
-   **Iconos**: Lucide React para mejor UX
-   **Dólar Blue integrado**: Movido al navbar para evitar que tape contenido en diferentes anchos

#### Mejoras Responsive

-   **Dólar Blue Display**:
    -   Ubicado en el centro del navbar con `flex-1 flex justify-center`
    -   Escala adaptativa: 90% mobile → 100% desktop
    -   No interfiere con el título en ningún tamaño de pantalla
-   **Formulario + Resumen**:
    -   Desktop: Lado a lado (2fr + 1fr)
    -   Mobile: Apilado verticalmente (Resumen DEBAJO del formulario)
    -   Sticky solo en desktop (`md:sticky md:top-24`)
-   **Header responsive**:
    -   Padding adaptativo: py-12 mobile → py-16 desktop
    -   Tamaños de texto escalables
    -   Rating badge responsive con flex-wrap

#### Organización

-   Separación de responsabilidades: Formulario en Home, Gestión en ruta separada
-   Footer responsive con tamaños de texto adaptativos
-   Simplificación de página principal (sin DolarDisplay en header)
-   Eliminación de bloques informativos (Email, Cálculos, n8n)

### 🐛 Fixed

-   **Grid del formulario**: Removido inline style que impedía responsive correcto (desktop ahora muestra formulario y resumen lado a lado)
-   **Dólar Blue posicionamiento**: Ya no tapa el título en ningún viewport

---

## [1.0.0] - 2026-01-15 🎉

### ✨ Added - Integración con n8n + UX Mejorada

#### Integración Completa con n8n Cloud

-   **Webhook automático** a n8n Cloud cuando se crea una reserva
-   **Sincronización con Google Sheets**:
    -   Escritura automática de reservas en hoja del año actual
    -   Fecha de registro con zona horaria Argentina (UTC-3)
    -   Selector dinámico de año: `{{ $now.setZone('America/Buenos_Aires').toFormat('yyyy') }}`
    -   **Fix**: Cambio de `.year` a `.toFormat('yyyy')` para convertir número a string
    -   Formato correcto para que Google Sheets encuentre la hoja por nombre
-   **Configuración**:
    -   Variable de entorno `N8N_WEBHOOK_URL`
    -   Notificación no bloqueante (no afecta la respuesta al usuario)
    -   Logs de éxito/error en consola

#### Toast Notifications + Scroll Inteligente

-   **react-hot-toast** integrado para notificaciones elegantes
-   **Toast de éxito** al crear reserva con emoji 🎉
-   **Toast de error** para validaciones y errores de API
-   **Scroll automático** hacia "Últimas Reservas" después de crear
-   **Auto-refresh suave** después de 2 segundos
-   Configuración global en `app/layout.tsx`:
    -   Posición: top-right
    -   Duración: 3 segundos
    -   Estilo oscuro elegante

#### Mejoras UX

-   Eliminados banners de éxito/error antiguos
-   Feedback visual inmediato con toasts
-   Navegación automática para ver resultados
-   Experiencia de usuario más fluida y profesional
-   **Layout Responsive Optimizado**:
    -   Bloques "Últimas Reservas" y "Ocupación" lado a lado en desktop (≥1024px)
    -   Apilados verticalmente en mobile para mejor legibilidad
    -   Menos scroll necesario en pantallas grandes
    -   Grid CSS (`grid-cols-1 lg:grid-cols-2`)
-   **Formulario con Resumen Lateral**:
    -   Información calculada ahora aparece en columna derecha en desktop (≥768px)
    -   Panel "Resumen de Reserva" con posición sticky (siempre visible al scrollear)
    -   Incluye: días, costo total, descuentos, USD, saldo pendiente
    -   Mensaje placeholder cuando no hay fechas seleccionadas
    -   En mobile: resumen aparece debajo del formulario
    -   Layout adaptativo: CSS Grid con `display: grid` y `gridTemplateColumns: 2fr 1fr`
    -   Reduce scroll y mejora la experiencia de carga de datos

#### Validaciones Mejoradas

-   **Mensajes amigables**: Reemplazados mensajes técnicos por textos claros al usuario
-   **Limpieza automática de errores**: Los errores desaparecen al seleccionar/escribir valores válidos
-   **Validación optimizada**: `mode: 'onTouched'` para validar solo cuando el usuario interactúa
-   **Feedback inmediato**: El usuario sabe instantáneamente si el dato es válido
-   **Limpieza post-submit mejorada**:
    -   `clearErrors()` antes de `reset()` para evitar re-validación
    -   Reset completo con todas las opciones de limpieza
    -   Formulario queda completamente limpio sin mensajes de error
-   **Validación de disponibilidad optimizada**:
    -   Debounce aumentado a 800ms para evitar validaciones excesivas
    -   Validación silenciosa sin cambiar el texto del botón
    -   Eliminado estado "Validando disponibilidad..." que causaba glitch visual
    -   Botón solo se deshabilita cuando hay conflicto de fechas

---

## [0.3.0] - 2026-01-15

### ✨ Added - Sistema de Gestión de Pagos y Ocupación

#### Nuevo Campo: Estado de Pago

-   Agregado campo `estadoPago` al modelo Reserva
-   Valores posibles: `'pendiente'` | `'pagado'`
-   Por defecto: `'pendiente'`
-   Se actualiza automáticamente a `'pagado'` si `saldoPendiente === 0`

#### Endpoint PATCH /api/reservas/[id]

-   Nuevo endpoint para actualizar el estado de pago de una reserva
-   Acepta: `{ estadoPago: 'pendiente' | 'pagado' }`
-   Validación de ID de MongoDB (24 caracteres)
-   Responde con reserva actualizada

#### Componente: Últimas Reservas Registradas

-   Lista de reservas ordenadas por fecha de creación (más recientes primero)
-   **Filtros**:
    -   "Hoy": Reservas creadas hoy
    -   "Esta Semana": Últimos 7 días
    -   "Todas": Sin filtro
-   **Badges visuales**:
    -   ✅ "Pagado" (verde) cuando `estadoPago === 'pagado'`
    -   ⏰ "Pendiente" (ámbar) cuando `estadoPago === 'pendiente'`
-   **Botón "Marcar Pagado"**:
    -   Aparece solo si hay saldo pendiente y estado es `'pendiente'`
    -   Actualiza estado a `'pagado'` con un click
    -   Feedback visual durante actualización
-   **Resumen**:
    -   Total de reservas filtradas
    -   Cantidad pagadas
    -   Cantidad pendientes
-   Información completa de cada reserva:
    -   Nombre, cabaña, origen
    -   Fechas y días de estadía
    -   Montos en ARS y USD
    -   Seña y saldo pendiente
    -   Fecha/hora de registro

#### Componente: Ocupación de Cabañas

-   Renombrado de "Reservas del Día" a "Ocupación de Cabañas"
-   **Bloqueo de fechas pasadas**:
    -   El botón ◀️ (retroceder) se deshabilita cuando se está en el día actual
    -   No permite navegar a días anteriores a hoy
    -   Mensaje visual cuando botón está deshabilitado
-   Muestra qué reservas están activas en un día específico
-   Indicadores de CHECK-IN y CHECK-OUT
-   Resumen de ocupación (cabañas ocupadas X / 2)

#### Organización de la Página

-   **Estructura de bloques** en página principal:
    1. Formulario de reserva
    2. **Últimas Reservas Registradas** (nuevo)
    3. **Ocupación de Cabañas** (renombrado y mejorado)
    4. Cards informativas
-   Separación visual clara entre secciones
-   Responsive en todos los componentes

### 🎨 Changed

-   Middleware de Mongoose ahora actualiza `estadoPago` automáticamente si saldo es 0
-   Mejoras en UX con estados de loading y transiciones suaves
-   Botones con `cursor-pointer` consistente en toda la aplicación

### 🔄 Refactor

-   Renombrado `ReservasDelDia` → `OcupacionCabanas` para mejor claridad semántica
-   Separación de responsabilidades:
    -   **UltimasReservas**: Gestión de pagos y reservas recientes
    -   **OcupacionCabanas**: Planificación y disponibilidad futura

---

## [0.2.0] - 2026-01-15

### ✨ Added - Vista de Reservas del Día

#### Componente ReservasDelDia

-   Nuevo componente `ReservasDelDia` para visualizar reservas de un día específico
-   Navegación de fechas con botones anterior/siguiente
-   Botón "Hoy" para volver rápidamente al día actual
-   Indicadores visuales de CHECK-IN y CHECK-OUT según la fecha
-   Resumen diario con:
    -   Total de reservas del día
    -   Cabañas ocupadas (X / 2)
-   Estados de carga y error manejados elegantemente
-   Mensaje cuando no hay reservas en el día

#### API Endpoint

-   Nuevo endpoint `GET /api/reservas/dia?fecha=YYYY-MM-DD`
-   Busca reservas que incluyan el día consultado
-   Lógica: Una reserva incluye un día si `fechaInicio <= día < fechaFin`
-   Responde con array de reservas ordenadas por fecha de inicio

#### Mejoras UX

-   Tarjetas de reserva con información completa:
    -   Nombre del huésped
    -   Número de cabaña (badge)
    -   Origen de reserva (badge)
    -   Fechas de estadía y cantidad de días
    -   Montos en ARS y USD
    -   Saldo pendiente (si aplica)
-   Badges de CHECK-IN/OUT con colores distintivos (verde/rojo)
-   Diseño responsive y elegante
-   Actualización automática al cambiar de día

#### Integración

-   Componente agregado en página principal después del formulario
-   Usa misma paleta de colores del sistema (stone/amber)
-   Compatible con la estructura existente

### 🎨 Changed

-   Optimización del envío de emails en segundo plano (no bloquea respuesta al usuario)
-   Mejoras en template de email:
    -   Centrado de badges de cabaña y origen
    -   Mejor alineación vertical de elementos
-   Campo "Seña" ahora tiene valor por defecto de `0`
-   Corrección de zona horaria en selección de fechas (fix: fechas se marcaban con un día de desfase)
-   Persistencia mejorada en formulario (guarda datos en localStorage)
-   Footer con año dinámico y link a portfolio del desarrollador
-   Display de Dólar Blue reubicado en esquina superior derecha del header

### 🐛 Fixed

-   **Problema**: Fechas en formulario se seleccionaban con un día de desfase (ej: seleccionar 16 marcaba 15)
-   **Causa**: `new Date('2026-01-16')` se interpreta como medianoche UTC, y al convertir a hora local argentina (UTC-3) retrocede un día
-   **Solución**: Crear fechas directamente en zona horaria local usando el constructor `new Date(year, month - 1, day)`
-   **Código antes**:
    ```typescript
    const date = e.target.value ? new Date(e.target.value) : undefined
    setValue('fechaInicio', date as Date)
    ```
-   **Código después**:
    ```typescript
    if (e.target.value) {
        const [year, month, day] = e.target.value.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        setValue('fechaInicio', date)
    }
    ```

---

## [0.1.0] - 2026-01-14

### ✨ Added - Versión Inicial

#### Sistema Base

-   Inicialización del proyecto con Next.js 16, TypeScript y Tailwind CSS 4
-   Configuración de shadcn/ui con paleta de colores cálida (tonos stone/amber)
-   Estructura de carpetas organizada: `app/`, `components/`, `lib/`, `models/`
-   Puerto configurado en 3001 para desarrollo y producción

#### Base de Datos

-   Integración con MongoDB usando Mongoose
-   Modelo `Reserva` con campos:
    -   `nombreCompleto`: Nombre del huésped
    -   `origenReserva`: Origen (Booking, Airbnb, Particular, Otro)
    -   `fechaInicio` y `fechaFin`: Rango de fechas
    -   `costoTotal` y `seña`: Montos económicos
    -   `saldoPendiente`: Calculado automáticamente
    -   `cantidadDias`: Calculado automáticamente
-   Middleware de Mongoose para cálculos automáticos pre-save
-   Sistema de caché de conexión para optimización

#### API

-   Endpoint `POST /api/reservas`: Crear nueva reserva
    -   Validación con Zod
    -   Cálculos automáticos (saldo y días)
    -   Envío de email automático (no bloquea si falla)
    -   Manejo de errores robusto
-   Endpoint `GET /api/reservas`: Listar reservas con paginación
    -   Parámetros: `page` y `limit`
    -   Ordenado por fecha de creación (más reciente primero)

#### Formulario de Reservas

-   Componente `ReservaForm` con React Hook Form
-   Campos:
    -   Nombre y apellido del huésped
    -   Selector de origen de reserva
    -   Date pickers con locale español (date-fns)
    -   Inputs numéricos para montos
-   Validación en tiempo real con Zod
-   Cálculo visual de saldo pendiente
-   Mensajes de éxito/error
-   Diseño responsive y elegante

#### Sistema de Emails

-   Template HTML responsive con diseño elegante
-   Colores corporativos (tonos madera/tierra)
-   Información completa de la reserva:
    -   Datos del huésped
    -   Fechas y cantidad de días
    -   Montos: total, seña y saldo pendiente
    -   Badge con origen de reserva
-   Configuración con Nodemailer (Gmail/SMTP)

#### UI/UX

-   Página principal con header destacado
-   Información de las cabañas (rating 9.9/10)
-   Cards informativas sobre funcionalidades
-   Footer institucional
-   Paleta de colores:
    -   Primario: `stone-700`, `stone-800`
    -   Acento: `amber-300`, `amber-50`
    -   Fondos: `stone-50`, `stone-100`

#### Documentación

-   README completo con:
    -   Instrucciones de instalación
    -   Configuración de variables de entorno
    -   Uso del formulario
    -   Documentación de API
    -   Guía de deployment
    -   Troubleshooting
-   Archivo `.cursorrules` con convenciones del proyecto
-   `.env.example` como referencia de configuración

#### Configuración

-   TypeScript con tipos estrictos
-   ESLint configurado
-   Variables de entorno:
    -   `MONGODB_URI`: Conexión a base de datos
    -   `EMAIL_*`: Configuración de SMTP

### 🔮 Próximamente

-   Integración con n8n para actualización automática de Excel
-   Conversión automática ARS → USD
-   Dashboard para visualizar reservas
-   Filtros y búsqueda de reservas
-   Edición de reservas existentes
-   Sistema de autenticación
-   Reportes y estadísticas

---

## Formato de Entradas

Cada versión debe seguir este formato:

````markdown
## [X.Y.Z] - YYYY-MM-DD

### ✨ Added

-   Nueva funcionalidad agregada

### 🐛 Fixed

-   **Problema**: Descripción del bug
-   **Causa**: Por qué ocurría
-   **Solución**: Cómo se arregló
-   **Código antes**:
    ```typescript
    // código problemático
    ```
````

-   **Código después**:
    ```typescript
    // código corregido
    ```

### 🎨 Changed

-   Mejora o modificación de funcionalidad existente

### 🗑️ Removed

-   Funcionalidad removida y por qué

```

---

## Notas

- Este proyecto usa **Semantic Versioning**: MAJOR.MINOR.PATCH
- Todas las fechas están en formato ISO 8601: YYYY-MM-DD
- Los cambios se documentan en español para facilitar el mantenimiento
```
