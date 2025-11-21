import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const navegar = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await axios.post(
        "http://localhost:5000/api/usuarios/registrar",
        { nombre, correo, contraseña }
      );

      if (respuesta.status === 201) {
        setMensaje("Registro exitoso. Ahora inicia sesión.");
        setTimeout(() => {
          setCargando(false);
          navegar("/iniciar-sesion");
        }, 2000);
      }
    } catch (error) {
      setCargando(false);
      console.error("Error al registrar usuario:", error);
      setMensaje(
        error.response?.data?.mensaje || "Error al registrarse. Intenta nuevamente."
      );
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "380px" }} className="shadow p-4">
        <h3 className="text-center mb-4">Crear Cuenta</h3>

        {mensaje && (
          <Alert variant={mensaje.includes("exitoso") ? "success" : "danger"}>
            {mensaje}
          </Alert>
        )}

        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Crea una contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-2"
            disabled={cargando}
          >
            {cargando ? "Procesando..." : "Registrarme"}
          </Button>
        </Form>

        <p className="text-center mt-3">
          ¿Ya tienes cuenta?{" "}
          <a href="/iniciar-sesion" className="text-decoration-none">
            Inicia sesión aquí
          </a>
        </p>
      </Card>
    </Container>
  );
}

export default Registro;
