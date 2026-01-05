import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';
import { DeletePopUp } from '../../components/DeletePopUp';
import { ItemList } from '../../components/ItemList';

export const AdminLanguages = () => {

  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState(null);
  const [languageToDelete, setLanguageToDelete] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetchData(
          `${backendUrl}/admin/lang/getall`,
          'GET',
          null,
          token
        );
        // console.log(response)
        setLanguages(response.languages || []);
      } catch (err) {
        setError(err.message || 'Error al cargar idiomas');
      }
    };
    loadLanguages();
  }, [backendUrl, fetchData]);

  const handleDeleteLanguage = async () => {
    setDeleteLoading(true);
    setError(null);
    setDeleteSuccess('');
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/admin/lang/delete/${languageToDelete.id_language}`,
        'DELETE',
        null,
        token
      );
      setLanguages(languages.filter(lang => lang.id_language !== languageToDelete.id_language));
      setShowDeletePopup(false);
      setLanguageToDelete(null);
      setDeleteSuccess('Idioma eliminado correctamente.');
    } catch (err) {
      setError(err.message || 'Error al eliminar el idioma');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeletePopup = (language) => {
    setLanguageToDelete(language);
    setShowDeletePopup(true);
  };

  return (
    <>
      <h1>Gestión de idiomas</h1>
      <p>Aquí puedes gestionar los idiomas disponibles en la plataforma.</p>
      <Link to='/admin/lang/create'>
        <button>Añadir nuevo idioma</button>
      </Link>
      <h2>Idiomas disponibles:</h2>
      {loading && <p>Cargando idiomas...</p>}
      {deleteSuccess && <p className='successMessage'>{deleteSuccess}</p>}
      {error && <p className='errorMessage'>{error}</p>}

      <section className='itemList'>
        {languages.length === 0 && !loading && <p>No hay idiomas disponibles.</p>}
        {languages.map((lang) => (

          <ItemList
            key={lang.id_language}
            itemObject={lang}
            itemName={lang.language}
            stateObject={{ language: lang }}
            onMainPath={`/admin/categories/${lang.id_language}`}
            onModifyPath={`/admin/lang/modify/${lang.id_language}`}
            onDelete={openDeletePopup}
          />
        ))}
      </section>

      {/* Popup para eliminar idioma */}
      {showDeletePopup && languageToDelete && (
        <DeletePopUp
          type="este idioma"
          item={languageToDelete.language}
          onConfirm={handleDeleteLanguage}
          onCancel={() => setShowDeletePopup(false)}
          loading={deleteLoading}
          error={error}
        />
      )}
    </>
  );
}
