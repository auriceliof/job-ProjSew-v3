import './index.css'
import App from './App.tsx'
import ReactDOM from 'react-dom/client'
import { Outlet } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Outlet />
  </>

)
