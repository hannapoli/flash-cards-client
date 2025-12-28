import './App.css'
import { Footer } from './components/Footer'
import { AuthProvider } from './contexts/AuthContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {

  return (
    <>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      <Footer />
    </>
  )
}

export default App
