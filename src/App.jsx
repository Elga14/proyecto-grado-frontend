import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import IniciarSesion from "./paginas/IniciarSesion";
import Registro from "./paginas/Registro";
import Inicio from "./paginas/Inicio";
import BarraNavegacion from "./componentes/BarraNavegacion";
import PanelAdministrador from "./paginas/PanelAdministrador";
import DetallesCurso from "./paginas/DetallesCurso";
import AdministradorCursoContenido from "./paginas/AdministradorContenidoCurso";
import EditarLeccion from "./paginas/EditarLeccion";

// 🆕 Importar las nuevas páginas
import MisCursos from "./paginas/MisCursos";
import ContenidoCurso from "./paginas/ContenidoCurso";

// Envoltorio necesario para permitir useLocation()
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
  const estaAutenticado = () => localStorage.getItem("token") !== null;

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
      {estaAutenticado() && !ocultarBarra && <BarraNavegacion rol={rol} />}

      <Routes>
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/inicio"
          element={estaAutenticado() ? <Inicio /> : <Navigate to="/iniciar-sesion" />}
        />

        {/* 🆕 Mis cursos */}
        <Route
          path="/mis-cursos"
          element={estaAutenticado() ? <MisCursos /> : <Navigate to="/iniciar-sesion" />}
        />

        {/* 🆕 Contenido del curso */}
        <Route
          path="/curso/:id/contenido"
          element={estaAutenticado() ? <ContenidoCurso /> : <Navigate to="/iniciar-sesion" />}
        />

        <Route
          path="/admin"
          element={
            estaAutenticado() && rol === "admin"
              ? <PanelAdministrador />
              : <Navigate to="/inicio" />
          }
        />

        <Route path="/admin/curso-contenido/:cursoId" element={<AdministradorCursoContenido />} />

        {/* ⚡ Ruta para editar lección */}
        <Route
          path="/admin/curso/:id/mod/:modIndex/leccion/:lecIndex"
          element={<EditarLeccion />}
        />

        <Route path="/curso/:id" element={<DetallesCurso />} />

        <Route path="*" element={<Navigate to="/iniciar-sesion" />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
