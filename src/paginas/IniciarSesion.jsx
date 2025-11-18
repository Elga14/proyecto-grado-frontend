import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";

function IniciarSesion() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navegar = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const respuesta = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contraseña }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        return setMensaje(datos.mensaje || "Error al iniciar sesión");
      }

      localStorage.setItem("token", datos.token);

      setMensaje("Inicio de sesión exitoso");

      navegar("/inicio");

    } catch (error) {
      console.error(error);
      setMensaje("No se puede conectar con el servidor");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "380px" }} className="shadow p-4">
        <h3 className="text-center mb-4">Iniciar Sesión</h3>

        {mensaje && (
          <Alert variant={mensaje.includes("exitoso") ? "success" : "danger"}>
            {mensaje}
          </Alert>
        )}

        <Form onSubmit={manejarLogin}>
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
              placeholder="Ingresa tu contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-2"
          >
            Ingresar
          </Button>
        </Form>

        <p className="text-center mt-3">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-decoration-none">
            Regístrate aquí
          </a>
        </p>
      </Card>
    </Container>
  );
}

export default IniciarSesion;
