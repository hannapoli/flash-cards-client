import { Link } from 'react-router';
import './AdminDashboard.scss';

export const AdminDashboardPage = () => {
  return (
    <>
    <section className='flexColumn centeredContent'>
      <h1 className='headingAdmin'>Panel de Administración</h1>
      <div className='btns flexColumn adminBtns'>
      <Link to='/admin/users'><button className='adminBtn'>Gestionar usuarios</button></Link>
      <Link to='/admin/lang'><button className='adminBtn'>Gestionar contenido</button></Link>
      </div>
    </section>
    </>
  )
}
