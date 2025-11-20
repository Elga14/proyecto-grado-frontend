import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Spinner } from "react-bootstrap";

function DetallesCurso() {
  const { id } = useParams();

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const obtenerCurso = async () => {
    try {
      const respuesta = await fetch(`http://localhost:5000/api/cursos/${id}`);
      const data = await respuesta.json();

      console.log("Respuesta del backend:", data);

      if (respuesta.ok) {
        // Soporta 3 posibles formas de respuesta
        setCurso(data.curso || data.data || data);
      } else {
        setMensaje("No se pudo cargar el curso.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al conectar con el servidor.");
    }

    setLoading(false);
  };

  useEffect(() => {
    obtenerCurso();
  }, []);

  const agregarAlCarrito = () => {
    if (!curso) return;

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existe = carrito.some((c) => c._id === curso._id);
    if (existe) {
      setMensaje("Este curso ya está en tu carrito.");
      return;
    }

    carrito.push(curso);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    setMensaje("Curso agregado al carrito.");
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!curso) {
    return (
      <Container className="mt-5 text-center">
        <h4>{mensaje}</h4>
      </Container>
    );
  }

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card style={{ width: "700px" }} className="shadow p-3">
        {curso?.imagen && (
          <Card.Img
            variant="top"
            src={curso.imagen}
            alt={curso.titulo}
            style={{ objectFit: "cover", height: "300px" }}
          />
        )}

        <Card.Body>
          <Card.Title className="fs-3">{curso.titulo}</Card.Title>

          <Card.Text>{curso.descripcion}</Card.Text>

          <h4 className="fw-bold mt-3">
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            }).format(curso.precio)}
          </h4>

          <Button variant="dark" className="mt-3 w-100" onClick={agregarAlCarrito}>
            Agregar al carrito
          </Button>

          {mensaje && <p className="mt-3 text-success">{mensaje}</p>}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DetallesCurso;
