import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Invitacion from './pages/Invitacion';
import Dashboard from './pages/Dashboard';
import Gracias from './pages/Gracias';
import Ticket from './pages/Ticket';
// Creamos un componente vacío temporal para que no tire error la ruta
const Admin = () => <div className="h-screen bg-white p-10"><h1>Acá va el panel de admin...</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: La pantalla de "¿Quién sos?" */}
        <Route path="/" element={<Login />} />

        {/* Ruta de la fiesta (donde irán después de poner el nombre) */}
        <Route path="/invitacion" element={<Invitacion />} />
        <Route path="/gracias" element={<Gracias />} />

        {/* Ruta del administrador */}

        <Route path="/admin" element={<Dashboard />} />
        <Route path="/ticket/:nombre" element={<Ticket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;