import ReactDOM from 'react-dom/client'
import MainRoutes from './routes.jsx'
import { BrowserRouter } from 'react-router-dom'

import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MainRoutes/>
  </BrowserRouter>
)
