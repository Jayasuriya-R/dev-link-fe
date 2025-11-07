import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import appStore from './Store/appStore.js'
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from './components/ErrorPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorPage}>
    <Provider store={appStore}>
    <App />
    </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
