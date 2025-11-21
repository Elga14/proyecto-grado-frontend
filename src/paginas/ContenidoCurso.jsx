import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, ListGroup, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";

const ContenidoCurso = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [comprado, setComprado] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);

        // 1️⃣ Obtener información del curso
        const cursoRes = await axios.get(`http://localhost:5000/api/cursos/${id}`);
        setCurso(cursoRes.data);

        const token = localStorage.getItem("token");

        // 2️⃣ Verificar si el usuario compró el curso
        const comprasRes = await axios.get(
          "http://localhost:5000/api/pedidos/mis-cursos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const yaComprado = comprasRes.data.some((c) => c._id === id);
        setComprado(yaComprado);

      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [id]);

  if (cargando || !curso)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="dark" />
      </Container>
    );

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-center mb-4">{curso.titulo}</h2>

      {!comprado && (
        <Alert variant="warning" className="text-center">
          🔒 <strong>No has adquirido este curso.</strong>
        </Alert>
      )}

      {curso.contenido.length === 0 ? (
        <p className="text-center">Este curso aún no tiene contenido.</p>
      ) : (
        curso.contenido.map((modulo, indiceModulo) => (
          <Card key={indiceModulo} className="mb-4 shadow-sm">
            <Card.Header className="fw-bold">📘 {modulo.modulo}</Card.Header>

            <ListGroup variant="flush">
              {modulo.lecciones.map((leccion, indiceLeccion) => (
                <ListGroup.Item
                  key={leccion._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>📖 {leccion.tituloLeccion}</span>

                  {comprado ? (
                    <Button
                      size="sm"
                      variant="dark"
                      onClick={() =>
                        navigate(`/curso/${id}/leccion/${indiceLeccion}`, {
                          state: { leccion },
                        })
                      }
                    >
                      Ver lección
                    </Button>
                  ) : (
                    <span style={{ color: "#999" }}>🔒 Bloqueado</span>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ContenidoCurso;
