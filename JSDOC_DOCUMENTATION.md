# Documentación del Cliente Flash Cards

## Generación de Documentación JSDoc

Este proyecto utiliza **JSDoc** para documentar el código JavaScript/React.

### Generar la Documentación

Para generar la documentación HTML:

```bash
yarn docs
```

Esto creará una carpeta `docs/` con la documentación HTML navegable.

### Ver la Documentación

Abre el archivo `docs/index.html` en tu navegador:

```bash
open docs/index.html
```

### Estructura de la Documentación

La documentación incluye:

#### Hooks Personalizados
- **`useFetch`**: Hook para realizar peticiones HTTP con manejo de estado
- **`useAuth`**: Hook para acceder al contexto de autenticación

#### Contextos
- **`AuthProvider`**: Proveedor de contexto de autenticación que gestiona Firebase y PostgreSQL

#### Helpers
- **`firebaseErrorMessages`**: Utilidad para convertir errores de Firebase a mensajes en español

#### Componentes
- **`ProgressComponent`**: Componente visual para mostrar progreso de aprendizaje

### Convenciones de Documentación

Cada función, hook y componente está documentado con:

- **@module**: Identificador del módulo
- **@description**: Descripción detallada de la funcionalidad
- **@param**: Parámetros con tipos y descripciones
- **@returns**: Tipo y descripción del valor de retorno
- **@throws**: Errores que puede lanzar
- **@example**: Ejemplos de uso

### Ejemplo de Documentación

```javascript
/**
 * Hook personalizado para realizar peticiones HTTP
 * @module hooks/useFetch
 * @returns {Object} Hook con estado y función fetchData
 * @property {function} fetchData - Función para realizar peticiones
 * @property {boolean} loading - Estado de carga
 * @property {*} data - Datos de la respuesta
 * @property {string|null} error - Mensaje de error
 * 
 * @example
 * const { fetchData, loading } = useFetch();
 * const response = await fetchData(url, 'GET', null, token);
 */
export const useFetch = () => {
  // ...
};
```

### Archivos Documentados

Los siguientes archivos contienen documentación JSDoc:

- `src/hooks/useFetch.js`
- `src/hooks/useAuth.js`
- `src/contexts/AuthProvider.jsx`
- `src/helpers/firebaseErrorMessages.js`
- `src/components/ProgressComponent.jsx`

### Agregar Más Documentación

Para documentar nuevos componentes o funciones:

1. Añade comentarios JSDoc encima de la función/componente
2. Incluye @param, @returns, @example según corresponda
3. Regenera la documentación con `yarn docs`

### Configuración JSDoc

La configuración se encuentra en `jsdoc.json`:

- **source**: Directorio src/ completo
- **destination**: Carpeta docs/
- **recurse**: Búsqueda recursiva
- **includePattern**: Archivos .js, .jsx, .ts, .tsx

### Recursos

- [JSDoc Documentation](https://jsdoc.app/)
- [JSDoc Cheatsheet](https://devhints.io/jsdoc)
- [JSDoc with React](https://www.inkoop.io/blog/a-guide-to-js-docs-for-react-js/)
