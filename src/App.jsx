import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import IniciarSesion from "./paginas/IniciarSesion";
import Registro from "./paginas/Registro";
import Inicio from "./paginas/Inicio";
import Perfil from "./paginas/Perfil";
import BarraNavegacion from "./componentes/BarraNavegacion";
import PanelAdministrador from "./paginas/PanelAdministrador";
import DetallesCurso from "./paginas/DetallesCurso";

// =========================================
// Envoltorio necesario para permitir useLocation()
// =========================================
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();

  // ------------------------------------------
  // Verificar si el usuario está autenticado
  // ------------------------------------------
  const isAuthenticated = () => localStorage.getItem("token") !== null;

  // ------------------------------------------
  // Obtener el rol desde el token guardado
  // ------------------------------------------
  const obtenerRol = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.rol; // "admin" o "usuario"
    } catch {
      return null;
    }
  };

  const rol = obtenerRol();

  // ------------------------------------------
  // Rutas donde NO debe aparecer la barra
  // ------------------------------------------
  const rutasSinBarra = ["/iniciar-sesion", "/registro"];

  const ocultarBarra = rutasSinBarra.includes(location.pathname);

  return (
    <>
      {/* Barra visible SOLO si hay sesión y no estamos en login/registro */}
      {isAuthenticated() && !ocultarBarra && <BarraNavegacion rol={rol} />}

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

        {/* =============================
            RUTA PROTEGIDA PARA ADMIN
           ============================= */}
        <Route
          path="/admin"
          element={
            isAuthenticated() && rol === "admin"
              ? <PanelAdministrador />
              : <Navigate to="/inicio" />
          }
        />

        {/* =============================
              DETALLES DEL CURSO
           ============================= */}
        <Route
          path="/cursos/:id"
          element={<DetallesCurso />}
        />

        <Route path="*" element={<Navigate to="/iniciar-sesion" />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
