import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import './index.css';
import Welcome from './pages/Welcome';
import Dueno from './pages/Dueno';
import Cliente from './pages/Cliente';
import ClientePortal from './pages/ClientePortal';

function App() {
  useLenis();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dueno" element={<Dueno />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/cliente-portal" element={<ClientePortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;