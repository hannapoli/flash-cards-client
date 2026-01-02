import { Link } from 'react-router';

export const AdminDashboardPage = () => {
  return (
    <>
    <h1>Panel de Administración</h1>
    <Link to="/admin/users"><button>Gestionar usuarios</button></Link>
    <Link to="/admin/languages"><button>Gestionar contenido</button></Link>
    </>
  )
}
