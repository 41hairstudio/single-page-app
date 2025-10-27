# 41hairstudio - Sitio Web Oficial

Sitio web profesional para la barbería 41hairstudio en Sevilla. Landing page moderna con sistema de reservas online, galería de trabajos y optimización SEO completa.

## 🚀 Características

- ✅ Landing page moderna y responsive
- ✅ Sistema de reservas online con confirmación por email
- ✅ Calendario interactivo con validación de horarios
- ✅ Integración con festivos españoles
- ✅ Galería de trabajos con carousel
- ✅ Optimización SEO completa
- ✅ Schema.org markup para mejor indexación
- ✅ Open Graph y Twitter Cards
- ✅ Descarga de eventos de calendario (.ics)
- ✅ LocalStorage para gestión de reservas

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **EmailJS** - Servicio de emails
- **react-calendar** - Selector de fechas
- **keen-slider** - Carousel de imágenes
- **Spanish Holidays API** - Festivos automáticos

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm run dev

# Build para producción
pnpm run build

# Preview del build
pnpm run preview
```

## ⚙️ Configuración

### 1. Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID_CLIENT=tu_template_id_cliente
VITE_EMAILJS_TEMPLATE_ID_BARBER=tu_template_id_barbero
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
VITE_BARBER_EMAIL=email_del_barbero@ejemplo.com
```

### 2. EmailJS

1. Crear cuenta en [EmailJS](https://www.emailjs.com/)
2. Configurar servicio de email
3. Crear dos templates (cliente y barbero)
4. Copiar las credenciales al `.env`

Ver documentación completa en `/EMAILJS_CONFIGURACION.md`

### 3. SEO

Actualizar en `index.html`:
- Teléfono de contacto
- URLs de redes sociales
- Dominio final
- Crear imágenes OG/Twitter

Ver guía completa en `/SEO_GUIDE.md`

## 📂 Estructura del Proyecto

```
single-page-app/
├── public/
│   ├── .htaccess           # Configuración Apache
│   ├── robots.txt          # SEO - Crawlers
│   ├── sitemap.xml         # SEO - Sitemap
│   └── [imágenes OG/Twitter por crear]
├── src/
│   ├── assets/             # Imágenes y recursos
│   ├── components/         # Componentes React
│   │   ├── BookingModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Schedule.tsx
│   │   └── Services.tsx
│   ├── utils/              # Utilidades
│   │   ├── calendar.ts     # Generación .ics
│   │   ├── emailService.ts # EmailJS
│   │   ├── holidays.ts     # API festivos
│   │   └── reservations.ts # LocalStorage
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── email-templates/        # Templates HTML para emails
│   ├── client-confirmation.html
│   └── barber-notification.html
├── EMAILJS_CONFIGURACION.md
├── SEO_GUIDE.md
└── README.md
```

## 🎨 Personalización

### Colores

Los colores principales están en `src/index.css`:
- Negro: `#000000`
- Blanco: `#ffffff`
- Gris: `#f5f5f5`

### Horarios

Configurar en `src/utils/reservations.ts`:
```typescript
// Lunes a Viernes
10:00 - 14:00
17:00 - 20:30

// Sábados
10:00 - 14:00

// Domingos: Cerrado
```

### Servicios

Editar en `src/components/Services.tsx`

### Galería

Añadir imágenes en `src/assets/` y actualizar `src/components/Gallery.tsx`

## 📧 Sistema de Emails

### Cliente
- Email de confirmación con detalles de la cita
- Botón de Google Maps
- Se envía automáticamente al confirmar reserva

### Barbero
- Notificación con datos del cliente
- Nombre, email y teléfono del cliente
- Misma información de fecha/hora

### Calendario
- Botón "Añadir a Calendario" en modal de confirmación
- Genera archivo .ics automáticamente
- Incluye recordatorio 1 día antes a las 10:00 AM

## 🔍 SEO

### Implementado
- ✅ Meta tags completos
- ✅ Open Graph (Facebook/LinkedIn)
- ✅ Twitter Cards
- ✅ Schema.org JSON-LD (HairSalon)
- ✅ Geo-targeting
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ .htaccess optimizado

### Pendiente
- [ ] Crear imágenes OG/Twitter
- [ ] Configurar Google Search Console
- [ ] Configurar Google My Business
- [ ] Instalar Google Analytics
- [ ] Actualizar URLs reales

Ver `/SEO_GUIDE.md` para detalles completos

## 🚀 Deploy

### Opción 1: Netlify
1. Conectar repositorio
2. Build command: `pnpm run build`
3. Publish directory: `dist`
4. Añadir variables de entorno

### Opción 2: Vercel
1. Importar proyecto
2. Framework preset: Vite
3. Añadir variables de entorno

### Opción 3: Hosting tradicional
1. Ejecutar `pnpm run build`
2. Subir carpeta `dist/` al servidor
3. Configurar `.htaccess` si es Apache

## 📱 Responsive

El sitio está completamente optimizado para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## ⚡ Performance

- Lazy loading de imágenes
- Compresión GZIP
- Minificación automática (Vite)
- Caché del navegador configurado
- Optimización de fuentes

## 🔒 Seguridad

- CORS configurado en EmailJS
- Validación de formularios
- Sanitización de inputs
- HTTPS recomendado

## 📞 Soporte

Para problemas o dudas:
1. Revisar documentación en `/EMAILJS_CONFIGURACION.md` y `/SEO_GUIDE.md`
2. Verificar variables de entorno
3. Comprobar consola del navegador

## 📄 Licencia

© 2025 41hairstudio. Todos los derechos reservados.

---

**Desarrollado con ❤️ para 41hairstudio**
