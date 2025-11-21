import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function BarraNavegacion({ rol }) {
  const navegar = useNavigate();

  // ----------------------------------------
  // Cerrar sesión
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

        <Navbar.Brand href="/inicio">Plataforma Cursos</Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-navegacion" />

        <Navbar.Collapse id="menu-navegacion">
          <Nav className="ms-auto">

            <Nav.Link href="/inicio">Inicio</Nav.Link>
            <Nav.Link href="/mis-cursos">Mis Cursos</Nav.Link>
            <Nav.Link href="/perfil">Perfil</Nav.Link>
             {/* 👉 NUEVO: enlace al carrito */}
            <Nav.Link href="/carrito">
              🛒 Carrito
            </Nav.Link>

            {rol === "admin" && (
              <Nav.Link href="/admin">Administración</Nav.Link>
            )}

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
