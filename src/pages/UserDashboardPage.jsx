import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { auth } from '../firebase/firebaseConfig';
import { useFetch } from '../hooks/useFetch';

export const UserDashboardPage = () => {

  const [userLanguages, setUserLanguages] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [error, setError] = useState(null);

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setError(null);
        const token = await auth.currentUser?.getIdToken();
        const [userLangResponse, availableLangResponse] = await Promise.all([
          fetchData(
            `${backendUrl}/user/languages`, 
            'GET', 
            null, 
            token
          ),
          fetchData(
            `${backendUrl}/user/languages/available`, 
            'GET', 
            null, 
            token
          )
        ]);
        setUserLanguages(userLangResponse.userLanguages || []);
        setAvailableLanguages(availableLangResponse.availableLanguages || []);
      } catch (err) {
        setError(err.message || 'Error al cargar idiomas');
      }
    };
    loadLanguages();
  }, [backendUrl, fetchData]);

  return (
    <>
      <section className='flexColumn'>
        <div className='flexColumn centeredContent'>
          <h1>¡Aprende idiomas con Flash Cards!</h1>
        </div>
        {loading && <p>Cargando idiomas...</p>}
        {error && <p className='errorMessage'>{error}</p>}

        <h2 className='marginTop'>Tus idiomas:</h2>
        {userLanguages.length === 0 && !loading && <p className='marginTop'>Todavía no tienes idiomas añadidos. Explora los idiomas disponibles abajo.</p>}
        <section className='itemList'>
          {userLanguages.map((lang) => (
            <article key={lang.id_language} className='item flexColumn'>
              <Link to={`/user/lang/${lang.id_language}/categories`} state={{ language: lang }}>
                <button className='itemBtn'>{lang.language}</button>
              </Link>
            </article>
          ))}
        </section>

        <h2 className='marginTop'>Idiomas disponibles:</h2>
        {availableLanguages.length === 0 && !loading && <p className='marginTop'>¡Felicidades! Has aprendido todos los idiomas de nuestra colección.</p>}
        <section className='itemList'>
          {availableLanguages.map((lang) => (
            <article key={lang.id_language} className='item flexColumn'>
              <Link to={`/user/lang/${lang.id_language}/categories`} state={{ language: lang }}>
                <button className='itemBtn'>{lang.language}</button>
              </Link>
            </article>
          ))}
        </section>
      </section>
    </>
  )
}
