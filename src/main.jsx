import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay.jsx'
import TopProgressBar from './components/TopProgressBar.jsx'
import BackNavigationGuard from './components/BackNavigationGuard.jsx'
import { installAxiosLoadingInterceptors } from './lib/axiosLoading'

installAxiosLoadingInterceptors()

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      {/* Replace modal overlay with top progress bar */}
      <TopProgressBar />
      <BackNavigationGuard />
      {/* Keep overlay imported but not rendered */}
      <App />
    </BrowserRouter>
  // </StrictMode>,
)
