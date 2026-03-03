import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { auth } from '../../firebase/firebaseConfig';
import { useFetch } from '../../hooks/useFetch';

export const AdminLangModify = () => {
    const location = useLocation();
    const { language } = location.state || {};
    const { language_id } = useParams();

    const [formData, setFormData] = useState({
        id_language: language_id || '',
        language: language?.language || '',
        code: language?.code || ''
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

    const handleModifyLang = async (e) => {
        e.preventDefault();
        setModifyLoading(true);
        setModifyError(null);
        setModifySuccess('');
        try {
            if (!language) {
                setModifyError('No se ha encontrado el idioma.');
                return;
            }
            const token = await auth.currentUser?.getIdToken();

            const payload = {
                language: formData.language,
                code: formData.code
            };


            await fetchData(
                `${backendUrl}/admin/languages/${language_id}`,
                'PUT',
                payload,
                token
            );
            setModifySuccess('Idioma modificado correctamente.');
        } catch (error) {
            setModifyError(error.message || 'Error al modificar el idioma.');
        } finally {
            setModifyLoading(false);
        }
    };

    return (
        <>
            <h1>Gestión de idiomas</h1>

            <article className='flexColumn centeredContent'>
                <h2>Modificar idioma</h2>
                {modifySuccess && <p className='successMessage'>{modifySuccess}</p>}
                {modifyError && <p className='errorMessage'>{modifyError}</p>}

                <form onSubmit={handleModifyLang} className='flexColumn centeredContent'>
                    <div className='flexColumn'>
                        <label htmlFor='language'>Idioma:</label>
                        <input
                            type='text'
                            id='language'
                            name='language'
                            placeholder={`e.g. "Inglés"`}
                            value={formData.language}
                            onChange={handleChange}
                            noValidate

                        />
                    </div>

                    <div className='flexColumn'>
                        <label htmlFor='code'>Código del idioma:</label>
                        <input
                            type='text'
                            name='code'
                            id='code'
                            placeholder='e.g. "en"'
                            value={formData.code}
                            onChange={handleChange}
                            noValidate
                        />
                    </div>

                    <div>
                        <button type='submit' disabled={modifyLoading} className='confirmBtn marginTop'>
                            {modifyLoading ? 'Modificando...' : 'Modificar idioma'}
                        </button>
                    </div>
                </form>
                <Link to='/admin/lang'>
                    <button className='confirmBtn'>Volver a idiomas</button>
                </Link>
            </article>
        </>
    )
}