import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { auth } from '../firebase/firebaseConfig';
import { useFetch } from '../hooks/useFetch';
import { ProgressComponent } from '../components/ProgressComponent';

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
            `${backendUrl}/user/progress/languages`,
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
        const validUserLanguages = (userLangResponse.progress || []).filter(lang => 
          lang.progressPercentage > 0 || lang.totalWords > 0
        );
        setUserLanguages(validUserLanguages);
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
          <p>Explora los idiomas y añade palabras a tu colección.</p>
        </div>
        {loading && <p>Cargando idiomas...</p>}
        {error && <p className='errorMessage'>{error}</p>}

        {userLanguages.length === 0 && !loading && (
          <p className='marginTop'>Todavía no tienes idiomas añadidos. Explora los idiomas disponibles abajo.</p>
        )}

        {userLanguages.filter(lang => lang.progressPercentage !== 100).length > 0 && (
          <article>
            <h2 className='marginTop'>Mis idiomas:</h2>
            <section className='itemList'>
              {userLanguages.filter(lang => lang.progressPercentage !== 100).map((lang) => (
                <article key={lang.id_language} className='item flexContainer centeredContent'>
                  <Link to={`/user/lang/${lang.id_language}/categories`} state={{ language: lang }}>
                    <button className='itemBtn progressBtn'>{lang.language} ⭐️</button>
                  </Link>
                  <ProgressComponent percentage={lang.progressPercentage} />
                </article>
              ))}
            </section>
          </article>
        )}

        {availableLanguages.length > 0 && (
          <article>
            <h2 className='marginTop'>Idiomas disponibles:</h2>
            <p>Entra en el idioma y añade palabras nuevas a tu colección.</p>
            <section className='itemList'>
              {availableLanguages.map((lang) => (
                <article key={lang.id_language} className='item flexColumn'>
                  <Link to={`/user/lang/${lang.id_language}/categories`} state={{ language: lang }}>
                    <button className='itemBtn'>{lang.language} ➕</button>
                  </Link>
                </article>
              ))}
            </section>
          </article>
        )}

        {userLanguages.filter(lang => lang.progressPercentage === 100).length > 0 && (
          <article>
            <h2 className='marginTop'>Idiomas aprendidos:</h2>
            <p>¡Enhorabuena! Has aprendido todas las palabras de estos idiomas.</p>
            <section className='itemList'>
              {userLanguages.filter(lang => lang.progressPercentage === 100).map((lang) => (
                <article key={lang.id_language} className='item flexColumn'>
                  <Link to={`/user/lang/${lang.id_language}/categories`} state={{ language: lang }}>
                    <button className='itemBtn'>{lang.language} 🏆 </button>
                  </Link>
                </article>
              ))}
            </section>
          </article>
        )}
      </section>
    </>
  )
}
