// src/paginas/AdminPanel.jsx
import { useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";

function PanelAdministrador() {

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");

  const manejarCrearCurso = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const respuesta = await fetch("http://localhost:5000/api/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ titulo, descripcion, precio, imagen })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        return setMensaje(datos.mensaje || "No se pudo crear el curso.");
      }

      setMensaje("Curso creado correctamente.");

      // limpiar formulario
      setTitulo("");
      setDescripcion("");
      setPrecio("");
      setImagen("");

    } catch (error) {
        console.error("Error obteniendo curso:", error);
      setMensaje("Error al conectar con el servidor.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "450px" }} className="shadow p-4">
        <h3 className="text-center mb-4">Panel de Administrador</h3>

        {mensaje && (
          <Alert variant={mensaje.includes("correctamente") ? "success" : "danger"}>
            {mensaje}
          </Alert>
        )}

        <Form onSubmit={manejarCrearCurso}>
          <Form.Group className="mb-3">
            <Form.Label>Título del curso</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio (COP)</Form.Label>
            <Form.Control
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL de imagen</Form.Label>
            <Form.Control
              type="url"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100">
            Crear Curso
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default PanelAdministrador;
