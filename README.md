# Aplicación "Flash Cards" en React

Aplicación web desarrollada con el stack de PERN (PostgreSQL, Express, React, y Node.js) que permite a los usuarios crear, gestionar y practicar con tarjetas de palabras (flashcards) para facilitar el aprendizaje de nuevos idiomas. La aplicación incluye funcionalidades de autenticación de usuarios, gestión de tarjetas y sesiones de práctica interactivas.

## Instalación

1. Clona el repositorio y navega al directorio del proyecto:
    ```bash
    git clone git@github.com:hannapoli/flash-cards-client.git && cd flash-cards-client
    ```

2. Cambia a la rama develop y actualízala:
    ```bash
    git checkout develop && git pull origin develop
    ```

3. Instala las dependencias:
    ```bash
    yarn install
    ```

4. Configura las variables de entorno:
   - Duplica el archivo `.env.template` y renómbralo a `.env`
   - Completa las siguientes variables con los datos de tu proyecto Firebase:
     ```env
     VITE_BACKEND_URL=http://localhost:3000

     Los datos del Firebase:
     VITE_FIREBASE_API_KEY=tu-api-key
     VITE_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=tu-project-id
     VITE_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
     VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
     ```

5. Asegúrate de que el backend esté corriendo en su puerto: `http://localhost:3000`

6. Inicia la aplicación en modo desarrollo:
    ```bash
    yarn dev
    ```

7. La aplicación estará disponible en `http://localhost:5173`

## ¿Qué hace esta aplicación?

**Flash Cards** es una plataforma interactiva de aprendizaje de idiomas que permite a los usuarios:

### Para Usuarios Estándar:
- Registrarse e iniciar sesión con Firebase Authentication
- Explorar idiomas y categorías disponibles
- Crear su colección personal de palabras
- Estudiar palabras con tarjetas interactivas (flash cards)
- Marcar palabras como aprendidas
- Ver su progreso en tiempo real por categoría y idioma
- Buscar palabras específicas dentro de categorías
- Visualizar definiciones, transcripciones, ejemplos e imágenes de cada palabra

### Para Administradores:
- Gestión completa de usuarios (crear, editar, eliminar, cambiar roles)
- Gestión de idiomas (añadir nuevos idiomas al sistema)
- Gestión de categorías por idioma
- Gestión de palabras (CRUD completo con subida de imágenes)
- Administración de contenidos

### Características:
- Sistema de progreso visual con barras circulares (react-circular-progressbar)
- Buscador de palabras dentro de cada categoría
- Separación de palabras: disponibles, en colección, y aprendidas
- Reconocimiento visual a la hora de aprender las palabra de la colección
- Diseño intuitivo y responsive (Mobile First)
- Feedback visual (mensajes de éxito/error)
- CRUD completo sobre múltiples entidades
- Validación de formularios
- Confirmación antes de eliminar (popup modal)
- Búsqueda en tiempo real

## Arquitectura y Flujo de Usuario

### Sección Pública
- **Inicio/Home Page**: Página de bienvenida visible sin login
- **Login/Registro**: Formularios de autenticación

### Sección Privada - Usuario
1. **Dashboard de Idiomas**: Vista de idiomas disponibles y progreso
2. **Vista de Categorías**: Categorías por idioma con progreso
3. **Vista de Palabras**: Lista de palabras disponibles y en colección
4. **Tarjeta de Palabra**: Vista detallada con imagen, definición, transcripción y ejemplo

### Sección Privada - Administrador
1. **Panel de Administración**: Dashboard con acceso a todas las funcionalidades
2. **Gestión de Usuarios**: CRUD completo de usuarios
3. **Gestión de Contenido**: CRUD de idiomas, categorías y palabras
4. **Subida de Imágenes**: Sistema de upload para ilustrar palabras

## Estructura del Proyecto

```
flash-cards-client/
├── src/
│   ├── main.jsx               # Punto de entrada
│   ├── App.jsx                # Componente principal
│   ├── components/            # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProgressComponent.jsx
│   │   ├── WordCard.jsx
│   │   ├── DeletePopUp.jsx
│   │   └── ...
│   ├── pages/                 # Páginas/Vistas
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── UserDashboardPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   ├── user_learning/     # Páginas de usuario
│   │   │   ├── UserCategories.jsx
│   │   │   ├── UserWords.jsx
│   │   │   └── UserWordCard.jsx
│   │   └── admin_content/     # Páginas de admin
│   │       ├── AdminLanguages.jsx
│   │       ├── AdminCategories.jsx
│   │       └── AdminWords.jsx
│   ├── contexts/              # Context API
│   │   ├── AuthContext.js
│   │   └── AuthProvider.jsx
│   ├── routes/                # Configuración de rutas
│   │   ├── AppRoutes.jsx
│   │   └── PrivateRoutes.jsx
│   ├── hooks/                 # Hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── firebase/              # Configuración de Firebase
│   │   └── firebaseConfig.js
│   ├── helpers/               # Funciones auxiliares
│   │   ├── firebaseErrorMessages.js
│   │   └── findUidByEmail.js
│   └── assets/                # Recursos estáticos
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## Rutas de la Aplicación

### Rutas Públicas
- `/` - Página de inicio (pública)
- `/login` - Inicio de sesión
- `/register` - Registro de usuario

### Rutas Protegidas - Usuario
- `/user/dashboard` - Dashboard con idiomas del usuario
- `/user/lang/:language_id/categories` - Categorías de un idioma
- `/user/lang/:language_id/categories/:category_id/words` - Palabras de una categoría
- `/user/lang/:language_id/categories/:category_id/words/:word_id` - Tarjeta de palabra con detalles

### Rutas Protegidas - Administrador
- `/admin/dashboard` - Panel de administración
- `/admin/users` - Gestión de usuarios
- `/admin/languages` - Gestión de idiomas
- `/admin/categories` - Gestión de categorías
- `/admin/words` - Gestión de palabras
- `/admin/words/create` - Crear palabra con imagen
- `/admin/words/:id/edit` - Editar palabra

## Gestión de Estado

### Context API - AuthContext
Gestiona el estado global de autenticación:
- Estado del usuario (user, role, isLogged)
- Funciones de autenticación (login, register, logout)
- Persistencia de sesión
- Sincronización con Firebase

### Custom Hooks

**useAuth**
- Hook para acceder al contexto de autenticación
- Proporciona información del usuario y funciones de auth

**useFetch**
- Hook reutilizable para peticiones HTTP
- Gestiona loading, error y data states
- Incluye token de autenticación automáticamente

## Firebase Authentication

La aplicación utiliza Firebase para:

1. **Registro de usuarios**: `createUserWithEmailAndPassword`
2. **Inicio de sesión**: `signInWithEmailAndPassword`
3. **Persistencia de sesión**: `onAuthStateChanged`
4. **Tokens de autenticación**: `getIdToken()` para peticiones al backend
5. **Cierre de sesión**: `signOut`

**Flujo de autenticación:**
1. Usuario se registra/inicia sesión en Firebase
2. Firebase devuelve un token JWT
3. Cliente incluye el token en cada petición al backend
4. Backend verifica el token y consulta PostgreSQL para roles y datos

## Tecnologías Utilizadas

### Core
- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router v7** - Enrutamiento

### Estado y Datos
- **React Context API** - Gestión de estado global
- **Custom Hooks** - Lógica reutilizable (useAuth, useFetch)

### Autenticación
- **Firebase Authentication** - Sistema de autenticación
- **Firebase Firestore** - Sincronización mínima de usuarios

### UI/UX
- **SCSS/Sass** - Estilos
- **react-circular-progressbar** - Componente de progreso
- **Diseño Mobile First** - Responsive design

### Validación y Utilidades
- **express-validator** (backend) - Validación de inputs
- **Custom helpers** - Manejo de errores y utilidades

## Metodología de Desarrollo

Este proyecto se desarrolló siguiendo:

- **Metodología SCRUM**: Sprints y backlog
- **Git**: main, develop y feature
- **Separación de responsabilidades**: Componentes, hooks, contexts

## Compatibilidad de Navegadores

La aplicación es compatible con:
- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

## Licencia

Proyecto educativo - Todos los derechos reservados
