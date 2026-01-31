import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Invitacion from './pages/Invitacion';
import Dashboard from './pages/Dashboard';
import Gracias from './pages/Gracias';
import Ticket from './pages/Ticket';
import ControlAcceso from './pages/ControlAcceso';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/invitacion" element={<Invitacion />} />
        <Route path="/gracias" element={<Gracias />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/ticket/:nombre" element={<Ticket />} />
        <Route path="/access-control/:nombre" element={<ControlAcceso />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;