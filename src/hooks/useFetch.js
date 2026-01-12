import { useCallback, useState } from "react";

export const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Realiza una petición HTTP al backend con `fetch`, adjuntando JWT si existe.
   * @param {string} url - URL absoluta del endpoint del backend.
   * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
   * @param {object} body - Cuerpo para métodos con payload.
   * @param {string} token - JWT para Authorization Bearer.
   * @returns {Promise} - Datos de la respuesta.
   */
  const fetchData = useCallback(
    async (url, method = 'GET', body = null, token = null) => {
      setLoading(true);
      setError(null);

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      if (body && (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
      }

      // console.log('fetch:', url, 'method:', method, 'body:', body);

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          let errorMessage = `Error al hacer hacer la petición al servidor`;
          try {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            errorMessage = errorData.message || errorData.msg || errorData.error || errorMessage;
          } catch (parseError) {
            console.error('No se pudo parsear la respuesta de error');
          }
          throw new Error(errorMessage);
        }

        const responseData = await response.json();
        setData(responseData);
        setLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message || 'Error al conectar al servidor');
        setLoading(false);
        throw err;
      }
    }, []);

  return { data, loading, setLoading, error, setError, fetchData };
};
