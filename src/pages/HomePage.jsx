import { Link } from 'react-router';

export const HomePage = () => {
    return (
        <>
            <h1>¡Bienvenido a FlashCards!</h1>
            <p>Tu plataforma para aprender y practicar nuevos idiomas de manera efectiva.</p>
            <p>Regístrate o inicia sesión para comenzar a crear tus propias tarjetas de estudio y mejorar tus habilidades lingüísticas.</p>
            <div>
                <Link to="auth/register"><button>Registrarse</button></Link>
                <Link to="auth/login"><button>Iniciar sesión</button></Link>
            </div>
            <section>
                <h2>¿Por qué elegir FlashCards?</h2>
                <ul>
                    <li>Fácil de usar: Interfaz intuitiva para crear y gestionar tus tarjetas.</li>
                    <li>Personalizable: Crea tarjetas con texto, imágenes y audio.</li>
                    <li>Accesible: Accede a tus tarjetas desde cualquier dispositivo.</li>
                    <li>Seguimiento de progreso: Monitorea tu aprendizaje y mejora continuamente.</li>
                </ul>
            </section>
        </>
    )
}
