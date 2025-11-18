import { useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const respuesta = await fetch("http://localhost:5000/api/usuarios/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, correo, contraseña }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        return setMensaje(datos.mensaje || "Error al registrar usuario");
      }

      setMensaje("Usuario registrado correctamente");

      // Resetear formulario
      setNombre("");
      setCorreo("");
      setContraseña("");

    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "380px" }} className="shadow p-4">
        <h3 className="text-center mb-4">Registro de Usuario</h3>

        {mensaje && (
          <Alert variant={mensaje.includes("correctamente") ? "success" : "danger"}>
            {mensaje}
          </Alert>
        )}

        <Form onSubmit={manejarRegistro}>

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

          <Button variant="success" type="submit" className="w-100 mt-2">
            Registrarme
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
