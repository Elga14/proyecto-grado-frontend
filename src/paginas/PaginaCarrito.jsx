import React, { useContext, useState } from "react";
import { ContextoCarrito } from "./ContextoCarrito.jsx";
import { Container, Row, Col, Card, Button, Alert, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaginaCarrito = () => {
  const { carrito, eliminarDelCarrito, vaciarCarrito } = useContext(ContextoCarrito);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState(false);
  const [mensajeSesion, setMensajeSesion] = useState(""); // ⚠️ Mensaje de sesión expirada
  const navigate = useNavigate();

  const total = carrito.reduce((acc, curso) => acc + curso.precio, 0);

  const procesarCompra = async () => {
    const token = localStorage.getItem("token");

    // Validar token antes de procesar la compra
    if (!token) {
      setMensajeSesion("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      vaciarCarrito();
      return navigate("/iniciar-sesion");
    }

    const cursos = carrito.map((c) => c._id);

    try {
      // Envío correcto del token y tipo de contenido
      await axios.post(
        "http://localhost:5000/api/pedidos/crear",
        { cursos, total },
        { 
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );

      setExito(true);
      vaciarCarrito();
      setTimeout(() => {
        setExito(false);
        navigate("/inicio");
      }, 2500);
    } catch (err) {
      console.error("Error al procesar la compra:", err.response || err);

      // Manejar token inválido o expirado
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setMensajeSesion("Tu sesión ha expirado o el token es inválido. Inicia sesión nuevamente.");
        localStorage.removeItem("token");
        vaciarCarrito();
        return navigate("/iniciar-sesion");
      }

      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">🛒 Carrito de Compras</h2>

      {mensajeSesion && (
        <Alert variant="warning" className="text-center">
          ⚠️ {mensajeSesion}
        </Alert>
      )}

      {exito && (
        <Alert variant="success" className="text-center">
          ✅ ¡Compra realizada con éxito!
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          ❌ Error al procesar la compra.
        </Alert>
      )}

      {carrito.length === 0 && !exito ? (
        <div className="text-center">
          <p>Tu carrito está vacío.</p>
          <Button variant="dark" onClick={() => navigate("/inicio")}>
            Ir a cursos
          </Button>
        </div>
      ) : (
        <>
          <Row className="justify-content-center">
            {carrito.map((curso) => (
              <Col md={4} key={curso._id} className="mb-3">
                <Card
                  className="shadow-sm"
                  style={{ borderRadius: "15px", textAlign: "center" }}
                >
                  <Image
                    src={curso.imagenPortada || "https://via.placeholder.com/600x400?text=Sin+imagen"}
                    alt={curso.titulo}
                    fluid
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{curso.titulo}</Card.Title>
                    <Card.Text>{curso.descripcion}</Card.Text>
                    <p>
                      <strong>Precio:</strong> ${curso.precio}
                    </p>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminarDelCarrito(curso._id)}
                    >
                      Eliminar
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {!exito && (
            <div className="text-center mt-4">
              <h4>Total: ${total}</h4>
              <Button variant="secondary" className="me-2" onClick={vaciarCarrito}>
                Vaciar carrito
              </Button>
              <Button variant="dark" onClick={procesarCompra}>
                Proceder al pago 💳
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default PaginaCarrito;
