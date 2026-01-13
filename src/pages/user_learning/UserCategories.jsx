import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';
import { ProgressComponent } from '../../components/ProgressComponent';

export const UserCategories = () => {
    const { language_id } = useParams();
    const location = useLocation();
    const language = location.state?.language;

    const [userCategories, setUserCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [error, setError] = useState(null);

    const { fetchData, loading } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setError(null);
                const token = await auth.currentUser?.getIdToken();
                const [userCatResponse, availableCatResponse] = await Promise.all([
                    fetchData(
                        `${backendUrl}/user/progress/languages/${language_id}/categories`,
                        'GET',
                        null,
                        token
                    ),
                    fetchData(
                        `${backendUrl}/user/languages/${language_id}/categories/available`,
                        'GET',
                        null,
                        token
                    )
                ]);
                setUserCategories(userCatResponse.progress || []);
                setAvailableCategories(availableCatResponse.availableCategories || []);
            } catch (err) {
                setError(err.message || 'Error al cargar categorías');
            }
        };
        if (language_id) {
            loadCategories();
        }
    }, [backendUrl, fetchData, language_id]);

    return (
        <>
            <section className='flexColumn'>
                <div className='flexColumn centeredContent'>
                    <h1>{language?.language || 'Categorías'}</h1>
                    <p>Explora las categorías y añade palabras a tu colección.</p>
                    <Link to='/user/dashboard'>
                        <button className='marginTop'>Volver a idiomas</button>
                    </Link>
                </div>
                {loading && <p>Cargando categorías...</p>}
                {
                    userCategories.length === 0 &&
                    availableCategories.length === 0 &&
                    !loading && (
                        <p className='marginTop'>Todavía no hay categorías en este idioma.</p>
                    )
                }
                {error && <p className='errorMessage'>{error}</p>}

                {userCategories.length === 0 && availableCategories.length > 0 && !loading && (
                    <p className='marginTop'>Todavía no tienes categorías con palabras añadidas. Explora las categorías disponibles abajo.</p>
                )}

                {userCategories.filter(cat => cat.progressPercentage !== 100).length > 0 && (
                    <article>
                        <h2 className='marginTop'>Mis categorías:</h2>
                        <section className='itemList'>
                            {userCategories.filter(cat => cat.progressPercentage !== 100).map((cat) => (
                                <article key={cat.id_category} className='item flexContainer centeredContent'>
                                    <Link to={`/user/lang/${language_id}/categories/${cat.id_category}/words`} state={{ category: cat, language, progressPercentage: cat.progressPercentage }}>
                                        <button className='itemBtn progressBtn'>{cat.category} ⭐️</button>
                                    </Link>
                                    <ProgressComponent percentage={cat.progressPercentage} />
                                </article>
                            ))}
                        </section>
                    </article>
                )}

                {availableCategories.length > 0 && (
                    <article>
                        <h2 className='marginTop'>Categorías disponibles:</h2>
                        <p>Entra en la categoría y añade palabras nuevas a tu colección.</p>
                        <section className='itemList'>
                            {availableCategories.map((cat) => (
                                <article key={cat.id_category} className='item flexColumn'>
                                    <Link to={`/user/lang/${language_id}/categories/${cat.id_category}/words`} state={{ category: cat, language }}>
                                        <button className='itemBtn'>{cat.category} ➕</button>
                                    </Link>
                                </article>
                            ))}
                        </section>
                    </article>
                )}

                {userCategories.filter(cat => cat.progressPercentage === 100).length > 0 && (
                    <article>
                        <h2 className='marginTop'>Categorías aprendidas:</h2>
                        <p>¡Enhorabuena! Has aprendido todas las palabras de estas categorías.</p>
                        <section className='itemList'>
                            {userCategories.filter(cat => cat.progressPercentage === 100).map((cat) => (
                                <article key={cat.id_category} className='item flexColumn'>
                                    <Link to={`/user/lang/${language_id}/categories/${cat.id_category}/words`} state={{ category: cat, language }}>
                                        <button className='itemBtn'>{cat.category} 🏆 </button>
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
