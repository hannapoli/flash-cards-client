import './Header.scss'

export const Header = ({ children }) => {
  return (
    <header className='fullContainer'>
      {children}
    </header>
  )
}
