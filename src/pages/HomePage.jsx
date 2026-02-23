import { Link } from 'react-router';
import './HomePage.scss';

export const HomePage = () => {
    return (
        <>
            <main className='mainContainer contentWidth'>
                <section className='flexColumn centeredContent'>
                    <h1>¡Bienvenido a Flash Cards!</h1>
                    <div className='homeImage'>
                        <img src='/src/assets/images/flash-cards-logo-transparent2.png' alt='FlashCards' />
                    </div>
                    <p>Tu plataforma para <strong className='bold'>aprender y practicar</strong></p>
                    <p>nuevos <strong className='bold'>idiomas</strong> de manera efectiva.</p>
                    <p className='bold'>Regístrate o inicia sesión</p>
                    <p>para comenzar a crear tus propias <strong className='bold'>tarjetas de estudio</strong></p>
                    <p>y mejorar tus habilidades lingüísticas.</p>
                    <div className='btns flexColumn centeredContent marginTop'>
                        <Link to='auth/register'><button className='bigBtn longBtn marginTop'>Registrarse</button></Link>
                        <Link to='auth/login'><button className='bigBtn longBtn'>Iniciar sesión</button></Link>
                    </div>
                    <article className='flexColumn centeredContent infoSection'>
                        <h2>¿Por qué elegir Flash Cards?</h2>
                        <ul className='flexColumn '>
                            <li><strong className='bold'>Fácil de usar:</strong>
                                <p>Interfaz intuitiva para crear y gestionar tus tarjetas.</p></li>
                            <li><strong className='bold'>Personalizable:</strong>
                                <p>Crea tarjetas con texto, imágenes y audio.</p></li>
                            <li><strong className='bold'>Accesible:</strong>
                                <p>Accede a tus tarjetas desde cualquier dispositivo.</p></li>
                            <li><strong className='bold'>Seguimiento de progreso:</strong>
                                <p>Monitorea tu aprendizaje y mejora continuamente.</p></li>
                        </ul>
                    </article>
                </section>
            </main>
        </>
    )
}
