import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import IniciarSesion from "./paginas/IniciarSesion";
import Registro from "./paginas/Registro";
import Inicio from "./paginas/Inicio";
import Perfil from "./paginas/Perfil";

function App() {

  // Verificar si el usuario tiene un token (autenticado)
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  return (
    <Router>
      <Routes>

        {/* Página de inicio de sesión */}
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />

        {/* Página de registro */}
        <Route path="/registro" element={<Registro />} />

        {/* RUTA PROTEGIDA → solo entra si ha iniciado sesión */}
        <Route
          path="/inicio"
          element={isAuthenticated() ? <Inicio /> : <Navigate to="/iniciar-sesion" />}
        />

        {/* Perfil también protegido */}
        <Route
          path="/perfil"
          element={isAuthenticated() ? <Perfil /> : <Navigate to="/iniciar-sesion" />}
        />

        {/* Redirección inicial */}
        <Route path="*" element={<Navigate to="/iniciar-sesion" />} />

      </Routes>
    </Router>
  );
}

export default App;
