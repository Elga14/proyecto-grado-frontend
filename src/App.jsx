import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import IniciarSesion from "./paginas/IniciarSesion";
import Registro from "./paginas/Registro";
import Inicio from "./paginas/Inicio";
import Perfil from "./paginas/Perfil";
import BarraNavegacion from "./componentes/BarraNavegacion";

// Componente envoltorio para permitir useLocation()
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => localStorage.getItem("token") !== null;

  // Rutas donde NO debe aparecer la barra
  const rutasSinBarra = ["/iniciar-sesion", "/registro"];

  // ¿La ruta actual está en la lista de rutas sin barra?
  const ocultarBarra = rutasSinBarra.includes(location.pathname);

  return (
    <>
      {/* Mostrar barra solo si está autenticado y no estamos en login o registro */}
      {isAuthenticated() && !ocultarBarra && <BarraNavegacion />}

      <Routes>
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/inicio"
          element={isAuthenticated() ? <Inicio /> : <Navigate to="/iniciar-sesion" />}
        />

        <Route
          path="/perfil"
          element={isAuthenticated() ? <Perfil /> : <Navigate to="/iniciar-sesion" />}
        />

        <Route path="*" element={<Navigate to="/iniciar-sesion" />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
