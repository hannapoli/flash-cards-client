import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';

export const AdminCategoriesModify = () => {
    const location = useLocation();
    const { category, language_id, language } = location.state || {};
    const { category_id } = useParams(); 

    const [formData, setFormData] = useState({
        id_category: category_id || '',
        category: category?.category || '',
        language_id: language_id || ''
    });

    const [modifyLoading, setModifyLoading] = useState(false);
    const [modifyError, setModifyError] = useState(null);
    const [modifySuccess, setModifySuccess] = useState('');

    const { fetchData, loading } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleModifyCategory = async (e) => {
        e.preventDefault();
        setModifyLoading(true);
        setModifyError(null);
        setModifySuccess('');
        try {
            if (!category) {
                setModifyError('No se ha encontrado la categoría.');
                return;
            }
            const token = await auth.currentUser?.getIdToken();

            const payload = {
                category: formData.category,
                language_id: formData.language_id
            };


            await fetchData(
                `${backendUrl}/admin/category/edit/${category_id}`,
                'PUT',
                payload,
                token
            );
            setModifySuccess('Categoría modificada correctamente.');
        } catch (error) {
            setModifyError(error.message || 'Error al modificar la categoría.');
        } finally {
            setModifyLoading(false);
        }
    };

    return (
        <>
            <h1>Gestión de categorías</h1>

            <article className='itemDetails'>
                <h2>Modificar categoría</h2>
                <p>Idioma seleccionado: {language?.language}</p>

                {modifySuccess && <p className='successMessage'>{modifySuccess}</p>}
                {modifyError && <p className='errorMessage'>{modifyError}</p>}

                <form onSubmit={handleModifyCategory}>
                    <div>
                        <label htmlFor='category'>Categoría:</label>
                        <input
                            type='text'
                            id='category'
                            name='category'
                            placeholder={`e.g. "Deportes"`}
                            value={formData.category}
                            onChange={handleChange}
                            noValidate
                        />
                    </div>

                    <div>
                        <button type='submit' disabled={modifyLoading} className='confirmBtn'>
                            {modifyLoading ? 'Modificando...' : 'Modificar categoría'}
                        </button>
                    </div>
                </form>
                <Link to={`/admin/categories/${language_id}`} state={{ language, language_id }}>
                    <button>Volver a categorías</button>
                </Link>
            </article>
        </>
    )
}
