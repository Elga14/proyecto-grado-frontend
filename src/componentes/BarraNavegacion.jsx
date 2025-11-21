import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ContextoCarrito } from "../paginas/ContextoCarrito.jsx";

function BarraNavegacion({ rol }) {
  const navegar = useNavigate();
  const { carrito } = useContext(ContextoCarrito);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navegar("/iniciar-sesion");
  };

  return (
    <Navbar expand="lg" className="navbar-dark mb-4" style={{ backgroundColor: "var(--color-dark)" }}>
      <Container>
        <Navbar.Brand href="/inicio">Plataforma Cursos</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-navegacion" />
        <Navbar.Collapse id="menu-navegacion">
          <Nav className="ms-auto">
            <Nav.Link href="/inicio">Inicio</Nav.Link>

            {rol === "admin" && (
              <>
                <Nav.Link href="/admin">Administración</Nav.Link>
              </>
            )}

            {rol !== "admin" && (
              <>
                <Nav.Link href="/mis-cursos">Mis Cursos</Nav.Link>
                <Nav.Link href="/carrito" style={{ position: "relative" }}>
                  🛒 Carrito
                  {carrito.length > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-10px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {carrito.length}
                    </Badge>
                  )}
                </Nav.Link>
              </>
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
