import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const respuesta = await axios.post(
        "http://localhost:5000/api/usuarios/registrar",
        {
          nombre,
          correo,
          contraseña,
        }
      );

      if (respuesta.status === 201) {
        setTimeout(() => {
          setCargando(false);
          alert("✅ Registro exitoso. Ahora inicia sesión.");
          navigate("/iniciar-sesion");
        }, 2000);
      }
    } catch (error) {
      setCargando(false);
      console.error("Error al registrar usuario:", error);
      alert(error.response?.data?.mensaje || "Error al registrarse. Intenta nuevamente.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {cargando && <Loader />}

      <Card
        className="p-4 shadow-lg bg-dark text-white text-center fade-in"
        style={{ width: "22rem", borderRadius: "15px" }}
      >
        <h3 className="mb-4">Crear cuenta</h3>

        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Crea una contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-3" variant="light">
            Registrarme
          </Button>
        </Form>

        <p className="mt-2">
          ¿Ya tienes cuenta?{" "}
          <Link to="/iniciar-sesion" className="text-info text-decoration-none">
            Inicia sesión aquí
          </Link>
        </p>
      </Card>
    </Container>
  );
}

export default Registro;
