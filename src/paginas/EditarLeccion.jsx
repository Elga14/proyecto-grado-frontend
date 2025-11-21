import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  InputGroup
} from "react-bootstrap";
import axios from "axios";

const EditarLeccion = () => {
  // Debe coincidir exactamente con App.jsx
  const { id, modIndex, lecIndex } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [leccion, setLeccion] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 1️ Obtener curso y lección
  useEffect(() => {
    const obtenerLeccion = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cursos/${id}`);
        const cursoDatos = res.data;

        setCurso(cursoDatos);

        const modulo = cursoDatos.contenido?.[modIndex];
        const leccionSeleccionada = modulo?.lecciones?.[lecIndex];

        if (!leccionSeleccionada) {
          console.error("La lección no existe.");
        }

        setLeccion(leccionSeleccionada);
      } catch (err) {
        console.error("Error al obtener la lección:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerLeccion();
  }, [id, modIndex, lecIndex]);

  if (cargando || !leccion)
    return (
      <Container className="text-center py-5">
        <h4>Cargando lección...</h4>
      </Container>
    );

  // 2️ Guardar cambios
  const guardarCambios = async () => {
    try {
      const token = localStorage.getItem("token");

      const cursoActualizado = { ...curso };
      cursoActualizado.contenido[modIndex].lecciones[lecIndex] = leccion;

      await axios.put(
        `http://localhost:5000/api/cursos/${curso._id}`,
        cursoActualizado,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Lección actualizada correctamente ✔️");

      navigate(`/admin/curso-contenido/${curso._id}`);

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
    }
  };

  // 3️ Agregar pregunta al quiz
  const agregarPregunta = () => {
    const nuevaPregunta = {
      pregunta: "",
      opciones: ["", "", "", ""],
      respuestaCorrecta: ""
    };

    setLeccion({
      ...leccion,
      preguntas: [...(leccion.preguntas || []), nuevaPregunta]
    });
  };

  // 4️ Eliminar pregunta
  const eliminarPregunta = (index) => {
    const actualizadas = [...leccion.preguntas];
    actualizadas.splice(index, 1);

    setLeccion({ ...leccion, preguntas: actualizadas });
  };

  return (
    <Container className="py-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Volver
      </Button>

      <Card className="shadow">
        <Card.Body>
          <h2 className="fw-bold mb-4">Editar lección</h2>

          {/* Título */}
          <Form.Group className="mb-3">
            <Form.Label>Título de la lección</Form.Label>
            <Form.Control
              type="text"
              value={leccion.tituloLeccion}
              onChange={(e) =>
                setLeccion({ ...leccion, tituloLeccion: e.target.value })
              }
            />
          </Form.Group>

          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={leccion.descripcionLeccion || ""}
              onChange={(e) =>
                setLeccion({ ...leccion, descripcionLeccion: e.target.value })
              }
            />
          </Form.Group>

          {/* Tipo */}
          <Form.Group className="mb-3">
            <Form.Label>Tipo de lección</Form.Label>
            <Form.Select
              value={leccion.tipo}
              onChange={(e) => setLeccion({ ...leccion, tipo: e.target.value })}
            >
              <option value="video">Video</option>
              <option value="documento">Documento PDF</option>
              <option value="imagen">Imagen</option>
              <option value="texto">Texto</option>
              <option value="quiz">Cuestionario</option>
            </Form.Select>
          </Form.Group>

          {/* Tipo: video */}
          {leccion.tipo === "video" && (
            <Form.Group className="mb-3">
              <Form.Label>URL del video</Form.Label>
              <Form.Control
                value={leccion.videoUrl || ""}
                onChange={(e) =>
                  setLeccion({ ...leccion, videoUrl: e.target.value })
                }
              />
            </Form.Group>
          )}

          {/* Tipo: documento */}
          {leccion.tipo === "documento" && (
            <Form.Group className="mb-3">
              <Form.Label>URL del archivo PDF</Form.Label>
              <Form.Control
                value={leccion.archivoUrl || ""}
                onChange={(e) =>
                  setLeccion({ ...leccion, archivoUrl: e.target.value })
                }
              />
            </Form.Group>
          )}

          {/* Tipo: imagen */}
          {leccion.tipo === "imagen" && (
            <Form.Group className="mb-3">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                value={leccion.imagenUrl || ""}
                onChange={(e) =>
                  setLeccion({ ...leccion, imagenUrl: e.target.value })
                }
              />
            </Form.Group>
          )}

          {/* Tipo: texto */}
          {leccion.tipo === "texto" && (
            <Form.Group className="mb-3">
              <Form.Label>Contenido textual</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={leccion.contenidoTexto || ""}
                onChange={(e) =>
                  setLeccion({ ...leccion, contenidoTexto: e.target.value })
                }
              />
            </Form.Group>
          )}

          {/* Tipo: quiz */}
          {leccion.tipo === "quiz" && (
            <Card className="p-3 mt-3">
              <h5 className="fw-bold">❓ Preguntas del cuestionario</h5>

              <Button variant="dark" className="mb-3" onClick={agregarPregunta}>
                 Agregar pregunta
              </Button>

              <ListGroup>
                {leccion.preguntas?.map((preg, qIndex) => (
                  <ListGroup.Item key={qIndex}>
                    <Form.Group className="mb-2">
                      <Form.Label>Pregunta</Form.Label>
                      <Form.Control
                        value={preg.pregunta}
                        onChange={(e) => {
                          const actualizadas = [...leccion.preguntas];
                          actualizadas[qIndex].pregunta = e.target.value;
                          setLeccion({ ...leccion, preguntas: actualizadas });
                        }}
                      />
                    </Form.Group>

                    <Row>
                      {preg.opciones.map((opc, oIndex) => (
                        <Col md={6} key={oIndex} className="mb-2">
                          <InputGroup>
                            <InputGroup.Text>{oIndex + 1}</InputGroup.Text>
                            <Form.Control
                              value={opc}
                              onChange={(e) => {
                                const actualizadas = [...leccion.preguntas];
                                actualizadas[qIndex].opciones[oIndex] =
                                  e.target.value;
                                setLeccion({
                                  ...leccion,
                                  preguntas: actualizadas
                                });
                              }}
                            />
                          </InputGroup>
                        </Col>
                      ))}
                    </Row>

                    <Form.Group className="mt-2">
                      <Form.Label>Respuesta correcta</Form.Label>
                      <Form.Control
                        value={preg.respuestaCorrecta}
                        onChange={(e) => {
                          const actualizadas = [...leccion.preguntas];
                          actualizadas[qIndex].respuestaCorrecta =
                            e.target.value;
                          setLeccion({
                            ...leccion,
                            preguntas: actualizadas
                          });
                        }}
                      />
                    </Form.Group>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mt-3"
                      onClick={() => eliminarPregunta(qIndex)}
                    >
                     Eliminar pregunta
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}

          {/* Botón guardar */}
          <Button
            variant="success"
            className="mt-4 w-100"
            onClick={guardarCambios}
          >
           Guardar cambios
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditarLeccion;
