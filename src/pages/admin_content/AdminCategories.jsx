import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';
import { DeletePopUp } from '../../components/DeletePopUp';
import { ItemList } from '../../components/ItemList';

export const AdminCategories = () => {
  const location = useLocation();
  const { language, category, category_id } = location.state || {};
  const { language_id } = useParams();

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const { fetchData, loading } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Mostrar categorías del idioma que recibimos por params
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setError(null);
        const token = await auth.currentUser?.getIdToken();
        const response = await fetchData(
          `${backendUrl}/admin/languages/${language_id}/categories`,
          'GET',
          null,
          token
        );
        // console.log(response);
        setCategories(response.categories || []);
      } catch (err) {
        setError(err.message || 'Error al cargar categorías');
      }
    };
    if (language_id) {
      loadCategories();
    }
  }, [language_id, backendUrl, fetchData]);

  const handleDeleteCategory = async () => {
    setDeleteLoading(true);
    setError(null);
    setDeleteSuccess('');
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetchData(
        `${backendUrl}/admin/categories/${categoryToDelete.id_category}`,
        'DELETE',
        null,
        token
      );
      setCategories(categories.filter(cat => cat.id_category !== categoryToDelete.id_category));
      setShowDeletePopup(false);
      setCategoryToDelete(null);
      setDeleteSuccess('Categoría eliminada correctamente.');
    } catch (err) {
      setError(err.message || 'Error al eliminar la categoría');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeletePopup = (category) => {
    setCategoryToDelete(category);
    setShowDeletePopup(true);
  };

  return (
    <>
      <section className='flexColumn'>
        <div className='flexColumn centeredContent'>
          <h1>Gestión de categorías </h1>
          <h2>{language && `${language.language}`}</h2>
          <p>Aquí puedes gestionar las categorías disponibles para este idioma.</p>
          <Link to={`/admin/categories/create/${language_id}`} state={{ language_id, language }}>
            <button className='confirmBtn marginTop longBtn'>Crear nueva categoría</button>
          </Link>
          <Link to='/admin/lang'>
            <button className='confirmBtn longBtn'>Volver a idiomas</button>
          </Link>
        </div>
        {loading && <p>Cargando categorías...</p>}
        {deleteSuccess && <p className='successMessage'>{deleteSuccess}</p>}
        {error && <p className='errorMessage'>{error}</p>}

        {categories.length === 0 && !loading && <p className='marginTop'>No hay categorías disponibles para este idioma.</p>}
        <section className='itemList'>
          {categories.map((cat) => (
            <ItemList
              key={cat.id_category}
              itemObject={cat}
              itemName={cat.category}
              stateObject={{ category: cat, language_id, language }}
              onMainPath={`/admin/words/${cat.id_category}`}
              onModifyPath={`/admin/categories/modify/${cat.id_category}`}
              onDelete={openDeletePopup}
            />
          ))}
        </section>
      </section>

      {/* Popup para eliminar categoría */}
      {showDeletePopup && categoryToDelete && (
        <DeletePopUp
          type='esta categoría'
          item={categoryToDelete.category}
          onConfirm={handleDeleteCategory}
          onCancel={() => setShowDeletePopup(false)}
          loading={deleteLoading}
          error={error}
        />
      )}
    </>
  );
}
