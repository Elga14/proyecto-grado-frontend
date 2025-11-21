import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card, ListGroup, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AdministradorContenidoCurso = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevoModulo, setNuevoModulo] = useState("");
  const [nuevaLeccion, setNuevaLeccion] = useState({
    indiceModulo: null,
    titulo: "",
    tipo: "texto",
    url: "",
    contenidoTexto: ""
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { cursoId } = useParams();

  // 1 Cargar cursos
  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cursos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCursos(res.data);

        if (cursoId) {
          const curso = res.data.find(c => c._id === cursoId);
          if (curso) setCursoSeleccionado(curso);
        }
      } catch (error) {
        console.error("Error al cargar cursos:", error);
        if (error.response?.status === 403) {
          alert("❌ Tu sesión expiró. Vuelve a iniciar sesión.");
          localStorage.removeItem("token");
          navigate("/iniciar-sesion");
        }
      }
    };
    cargarCursos();
  }, [cursoId, token, navigate]);

  // 2 Guardar curso
  const guardarCurso = async (cursoData) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/cursos/${cursoData._id}`,
        cursoData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCursoSeleccionado(res.data.curso);
      setCursos(prev => prev.map(c => c._id === res.data.curso._id ? res.data.curso : c));
    } catch (error) {
      console.error("Error al guardar curso:", error);
      alert("No se pudo guardar el curso.");
      if (error.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/iniciar-sesion");
      }
    }
  };

  // 3️ Agregar módulo
  const agregarModulo = async () => {
    if (!nuevoModulo.trim()) return;
    const cursoActualizado = {
      ...cursoSeleccionado,
      contenido: [
        ...cursoSeleccionado.contenido,
        { modulo: nuevoModulo, lecciones: [] }
      ]
    };
    await guardarCurso(cursoActualizado);
    setNuevoModulo("");
  };

  // 4️ Eliminar módulo
  const eliminarModulo = async (indice) => {
    if (!window.confirm("¿Eliminar este módulo completo?")) return;
    const cursoActualizado = { ...cursoSeleccionado };
    cursoActualizado.contenido.splice(indice, 1);
    await guardarCurso(cursoActualizado);
  };

  // 5️ Agregar lección
  const agregarLeccion = async () => {
    const i = nuevaLeccion.indiceModulo;
    if (i === null) return;

    const cursoActualizado = { ...cursoSeleccionado };
    cursoActualizado.contenido[i].lecciones.push({
      titulo: nuevaLeccion.titulo,
      tipo: nuevaLeccion.tipo,
      url: nuevaLeccion.url,
      contenidoTexto: nuevaLeccion.contenidoTexto
    });

    await guardarCurso(cursoActualizado);

    setMostrarModal(false);
    setNuevaLeccion({
      indiceModulo: null,
      titulo: "",
      tipo: "texto",
      url: "",
      contenidoTexto: ""
    });
  };

  // 6️ Eliminar lección
  const eliminarLeccion = async (indiceModulo, indiceLeccion) => {
    if (!window.confirm("¿Eliminar esta lección?")) return;
    const cursoActualizado = { ...cursoSeleccionado };
    cursoActualizado.contenido[indiceModulo].lecciones.splice(indiceLeccion, 1);
    await guardarCurso(cursoActualizado);
  };

  return (
    <Container className="py-5">
      <h2 className="text-center">📚 Contenido del curso</h2>

      <Form.Select
        className="my-4"
        onChange={(e) => {
          const curso = cursos.find(c => c._id === e.target.value);
          setCursoSeleccionado(curso);
        }}
        value={cursoSeleccionado?._id || ""}
      >
        <option value="">Selecciona un curso</option>
        {cursos.map(c => (
          <option key={c._id} value={c._id}>{c.titulo}</option>
        ))}
      </Form.Select>

      {cursoSeleccionado && (
        <>
          <Card className="p-4 mb-4 shadow-sm">
            <h4>Agregar módulo</h4>
            <Form.Control
              placeholder="Nombre del módulo"
              value={nuevoModulo}
              onChange={(e) => setNuevoModulo(e.target.value)}
            />
            <Button className="mt-3" variant="dark" onClick={agregarModulo}>
               Agregar módulo
            </Button>
          </Card>

          {cursoSeleccionado.contenido.map((mod, iModulo) => (
            <Card key={iModulo} className="mb-3 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <strong>📘 {mod.modulo}</strong>
                <div>
                  <Button
                    size="sm"
                    variant="dark"
                    className="me-2"
                    onClick={() => {
                      setNuevaLeccion({ ...nuevaLeccion, indiceModulo: iModulo });
                      setMostrarModal(true);
                    }}
                  >
                     Lección
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => eliminarModulo(iModulo)}>
                    Eliminar módulo
                  </Button>
                </div>
              </Card.Header>

              <ListGroup>
                {mod.lecciones.map((l, iLeccion) => (
                  <ListGroup.Item
                    key={iLeccion}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                       <strong>{l.titulo}</strong> — <em>{l.tipo}</em>
                    </div>
                    <div>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() =>
                          navigate(`/admin/curso/${cursoSeleccionado._id}/mod/${iModulo}/leccion/${iLeccion}`)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => eliminarLeccion(iModulo, iLeccion)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          ))}
        </>
      )}

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nueva lección</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control
                value={nuevaLeccion.titulo}
                onChange={(e) => setNuevaLeccion({ ...nuevaLeccion, titulo: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={nuevaLeccion.tipo}
                onChange={(e) => setNuevaLeccion({ ...nuevaLeccion, tipo: e.target.value })}
              >
                <option value="texto">Texto</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </Form.Select>
            </Form.Group>

            {(nuevaLeccion.tipo === "video" || nuevaLeccion.tipo === "pdf") && (
              <Form.Group className="mt-3">
                <Form.Label>URL del archivo</Form.Label>
                <Form.Control
                  value={nuevaLeccion.url}
                  onChange={(e) => setNuevaLeccion({ ...nuevaLeccion, url: e.target.value })}
                />
              </Form.Group>
            )}

            {nuevaLeccion.tipo === "texto" && (
              <Form.Group className="mt-3">
                <Form.Label>Contenido</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={nuevaLeccion.contenidoTexto}
                  onChange={(e) => setNuevaLeccion({ ...nuevaLeccion, contenidoTexto: e.target.value })}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="dark" onClick={agregarLeccion}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdministradorContenidoCurso;
