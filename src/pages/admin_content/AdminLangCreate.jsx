import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useFetch } from '../../hooks/useFetch';
import { auth } from '../../firebase/firebaseConfig';

export const AdminLangCreate = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        language: '',
        code: ''
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [createSuccess, setCreateSuccess] = useState('');

    const { fetchData, loading } = useFetch();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setCreateError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setCreateError(null);
        setCreateSuccess('');
        try {
            const token = await auth.currentUser?.getIdToken();

            const payload = {
                language: formData.language,
                code: formData.code
            };
            await fetchData(
                `${backendUrl}/admin/languages`,
                'POST',
                payload,
                token
            );
            setCreateSuccess('Idioma creado correctamente.');
            setTimeout(() => {
                navigate(`/admin/lang`)
            }, 2000);
        } catch (error) {
            setCreateError(error.message || 'Error al crear el idioma');
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <>
            <article className='flexColumn centeredContent'>
            <h1>Gestión de idiomas</h1>
                <h2>Añadir nuevo idioma</h2>

                {createSuccess && <p className='successMessage'>{createSuccess}</p>}
                {createError && <p className='errorMessage'>{createError}</p>}

                <form onSubmit={handleSubmit} className='flexColumn centeredContent'>
                    <div className='flexColumn'>
                        <label htmlFor='language'>Idioma:</label>
                        <input
                            type='text'
                            name='language'
                            id='language'
                            placeholder={`e.g. 'Inglés'`}
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
                    <button type='submit' disabled={createLoading} className='confirmBtn marginTop'>
                        {createLoading ? 'Creando...' : 'Crear idioma'}
                    </button>
                </form>
                <Link to='/admin/lang'>
                    <button className='confirmBtn'>Volver a idiomas</button>
                </Link>
            </article>
        </>
    )
}