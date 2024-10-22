import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SocketProvider } from './context/SocketProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </SocketProvider>
)
