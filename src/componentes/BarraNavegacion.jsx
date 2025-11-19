// ========================================
// Barra de Navegación principal
// Muestra las rutas del sistema cuando
// el usuario ha iniciado sesión.
// ========================================

import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function BarraNavegacion() {
  const navegar = useNavigate();

  // ----------------------------------------
  // Cerrar sesión: elimina el token y redirige
  // ----------------------------------------
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navegar("/iniciar-sesion");
  };

  return (
    <Navbar
      expand="lg"
      className="navbar-dark mb-4"
      style={{ backgroundColor: "var(--color-dark)" }}
    >
      <Container>
        {/* Título de la aplicación */}
        <Navbar.Brand href="/inicio">Plataforma Cursos</Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-navegacion" />

        <Navbar.Collapse id="menu-navegacion">
          <Nav className="ms-auto">

            {/* Enlaces de navegación */}
            <Nav.Link href="/inicio">Inicio</Nav.Link>
            <Nav.Link href="/perfil">Perfil</Nav.Link>

            {/* Botón para cerrar sesión */}
            <Button
              variant="light"
              className="ms-3"
              onClick={cerrarSesion}
              style={{ color: "var(--color-dark)", fontWeight: "500" }}
            >
              Cerrar Sesión
            </Button>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BarraNavegacion;
