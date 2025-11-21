import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  ListGroup,
  Spinner,
  Button,
  Badge
} from "react-bootstrap";
import axios from "axios";

const ContenidoCurso = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [cargando, setCargando] = useState(true);


  const [progreso, setProgreso] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);

        // Obtener información del curso
        const cursoRes = await axios.get(
          `http://localhost:5000/api/cursos/${id}`
        );
        setCurso(cursoRes.data);

        const token = localStorage.getItem("token");

        // Obtener progreso del usuario
        const progresoRes = await axios.get(
          `http://localhost:5000/api/progreso/curso/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setProgreso([
          {
            cursoId: id,
            leccionesCompletadas: progresoRes.data.leccionesCompletadas
          }
        ]);

      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [id]);

  const obtenerLeccionesCompletadas = () => {
    const registro = progreso.find((p) => p.cursoId === id);
    return registro ? registro.leccionesCompletadas : [];
  };

  const leccionesCompletadas = obtenerLeccionesCompletadas();

  if (cargando || !curso)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="dark" />
      </Container>
    );

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-center mb-4">{curso.titulo}</h2>

      {/* 🚫 Quitamos el aviso de "no comprado" */}

      {curso.contenido.length === 0 ? (
        <p className="text-center">Este curso aún no tiene contenido.</p>
      ) : (
        curso.contenido.map((modulo, indiceModulo) => (
          <Card key={indiceModulo} className="mb-4 shadow-sm">
            <Card.Header className="fw-bold">📘 {modulo.modulo}</Card.Header>

            <ListGroup variant="flush">
              {modulo.lecciones.map((leccion, indiceLeccion) => {
                const estaCompletada = leccionesCompletadas.includes(
                  leccion._id
                );

                return (
                  <ListGroup.Item
                    key={leccion._id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>
                      📖 {leccion.tituloLeccion}{" "}
                      {estaCompletada && (
                        <Badge bg="success">Completada ✔</Badge>
                      )}
                    </span>

                    {/* 🔓 Siempre permitir ver la lección */}
                    <Button
                      size="sm"
                      variant="dark"
                      onClick={() =>
                        navigate(`/curso/${id}/leccion/${indiceLeccion}`, {
                          state: { leccion }
                        })
                      }
                    >
                      Ver lección
                    </Button>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ContenidoCurso;
