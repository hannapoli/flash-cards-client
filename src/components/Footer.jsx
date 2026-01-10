import {Link} from 'react-router';
import './Footer.scss';

export const Footer = () => {
  return (
    <>
      <footer className='fullContainer flexContainer'>
        <p>&copy; 2026 Hanna Polishchuk</p>
        <p><Link to='https://github.com/hannapoli'>GitHub</Link></p>
        <p><Link to='https://www.linkedin.com/in/hannapoli/'>LinkedIn</Link></p>
      </footer>
    </>
  )
}
