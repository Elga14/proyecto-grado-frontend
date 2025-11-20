import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Button,
  Form,
  Modal,
  Toast,
  ToastContainer,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PanelAdministrador = () => {
  const [cursos, setCursos] = useState([]);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState("");
  const [tipoToast, setTipoToast] = useState("success");

  const [nuevoCurso, setNuevoCurso] = useState({
    titulo: "",
    descripcion: "",
    nivel: "",
    duracion: "",
    precio: "",
    categoria: "General",
    imagenPortada: "",
    contenido: [],
  });

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Obtener todos los cursos
  const obtenerCursos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:5000/api/cursos");
      setCursos(respuesta.data);
    } catch (error) {
      console.error("Error al obtener los cursos:", error);
      setMensajeToast("❌ Error al cargar cursos");
      setTipoToast("danger");
      setMostrarToast(true);
    }
  };

  // Crear curso
  const crearCurso = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/cursos/crear",
        nuevoCurso,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMostrarModalCrear(false);
      setNuevoCurso({
        titulo: "",
        descripcion: "",
        nivel: "",
        duracion: "",
        precio: "",
        categoria: "General",
        imagenPortada: "",
        contenido: [],
      });
      setMensajeToast("✅ Curso creado exitosamente");
      setTipoToast("success");
      setMostrarToast(true);
      obtenerCursos();
    } catch (error) {
      console.error("Error al crear curso:", error);
      if (error.response?.status === 403) {
        setMensajeToast("❌ No tienes permisos para crear cursos");
      } else {
        setMensajeToast(error.response?.data?.mensaje || "❌ Error al crear curso");
      }
      setTipoToast("danger");
      setMostrarToast(true);
    }
  };

  // Editar curso
  const editarCurso = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/cursos/${cursoSeleccionado._id}`,
        cursoSeleccionado,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMostrarModalEditar(false);
      setCursoSeleccionado(null);
      setMensajeToast("✅ Curso actualizado correctamente");
      setTipoToast("success");
      setMostrarToast(true);
      obtenerCursos();
    } catch (error) {
      console.error("Error al actualizar curso:", error);
      if (error.response?.status === 403) {
        setMensajeToast("❌ No tienes permisos para editar cursos");
      } else {
        setMensajeToast(error.response?.data?.mensaje || "❌ Error al actualizar curso");
      }
      setTipoToast("danger");
      setMostrarToast(true);
    }
  };

  // Eliminar curso
  const eliminarCurso = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este curso?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/cursos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensajeToast("✅ Curso eliminado correctamente");
      setTipoToast("success");
      setMostrarToast(true);
      obtenerCursos();
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      if (error.response?.status === 403) {
        setMensajeToast("❌ No tienes permisos para eliminar cursos");
      } else {
        setMensajeToast(error.response?.data?.mensaje || "❌ Error al eliminar curso");
      }
      setTipoToast("danger");
      setMostrarToast(true);
    }
  };

  useEffect(() => {
    obtenerCursos();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", paddingTop: "40px" }}>
      <Container>
        <Card className="p-4 shadow-lg border-0" style={{ borderRadius: "15px", backgroundColor: "#fff" }}>
          <h2 className="text-center mb-4 fw-bold text-dark">🧑‍💼 Panel de Administración</h2>
          <p className="text-center text-secondary mb-4">
            Gestiona los cursos disponibles en la plataforma.
          </p>

          <div className="d-flex justify-content-between mb-4">
            <Button variant="secondary" onClick={() => navigate("/home")}>
              Volver al inicio
            </Button>
            <Button variant="dark" onClick={() => setMostrarModalCrear(true)}>
              ➕ Crear nuevo curso
            </Button>
          </div>

          <div style={{ overflowX: "auto", borderRadius: "10px" }}>
            <Table striped bordered hover responsive className="shadow-sm text-center" style={{ backgroundColor: "#fafafa" }}>
              <thead className="table-dark">
                <tr>
                  <th>Título</th>
                  <th>Nivel</th>
                  <th>Duración</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cursos.length > 0 ? (
                  cursos.map((curso) => (
                    <tr key={curso._id}>
                      <td>{curso.titulo}</td>
                      <td>{curso.nivel}</td>
                      <td>{curso.duracion}</td>
                      <td>${curso.precio}</td>
                      <td>{curso.categoria}</td>
                      <td>
                        <img
                          src={curso.imagenPortada || "https://via.placeholder.com/600x400?text=Curso"}
                          alt={curso.titulo}
                          style={{ width: "60px", height: "40px", borderRadius: "5px", objectFit: "cover" }}
                        />
                      </td>
                      <td>
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setCursoSeleccionado(curso);
                            setMostrarModalEditar(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/admin/curso-contenido?curso=${curso._id}`)}
                        >
                          Contenido
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => eliminarCurso(curso._id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No hay cursos registrados.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Modal Crear Curso */}
        <Modal show={mostrarModalCrear} onHide={() => setMostrarModalCrear(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Crear nuevo curso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {["titulo", "descripcion", "nivel", "duracion", "precio"].map((campo) => (
                <Form.Group className="mb-3" key={campo}>
                  <Form.Label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</Form.Label>
                  <Form.Control
                    type={campo === "precio" ? "number" : "text"}
                    as={campo === "descripcion" ? "textarea" : "input"}
                    rows={campo === "descripcion" ? 3 : undefined}
                    value={nuevoCurso[campo]}
                    onChange={(e) => setNuevoCurso({ ...nuevoCurso, [campo]: e.target.value })}
                  />
                </Form.Group>
              ))}
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  value={nuevoCurso.categoria}
                  onChange={(e) => setNuevoCurso({ ...nuevoCurso, categoria: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Programación">Programación</option>
                  <option value="Diseño">Diseño</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Imagen de portada (URL)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://..."
                  value={nuevoCurso.imagenPortada}
                  onChange={(e) => setNuevoCurso({ ...nuevoCurso, imagenPortada: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModalCrear(false)}>
              Cancelar
            </Button>
            <Button variant="dark" onClick={crearCurso}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Editar Curso */}
        <Modal show={mostrarModalEditar} onHide={() => setMostrarModalEditar(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Editar curso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cursoSeleccionado && (
              <Form>
                {["titulo", "descripcion", "nivel", "duracion", "precio"].map((campo) => (
                  <Form.Group className="mb-3" key={campo}>
                    <Form.Label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</Form.Label>
                    <Form.Control
                      type={campo === "precio" ? "number" : "text"}
                      as={campo === "descripcion" ? "textarea" : "input"}
                      rows={campo === "descripcion" ? 3 : undefined}
                      value={cursoSeleccionado[campo]}
                      onChange={(e) =>
                        setCursoSeleccionado({ ...cursoSeleccionado, [campo]: e.target.value })
                      }
                    />
                  </Form.Group>
                ))}
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={cursoSeleccionado.categoria}
                    onChange={(e) =>
                      setCursoSeleccionado({ ...cursoSeleccionado, categoria: e.target.value })
                    }
                  >
                    <option value="General">General</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Programación">Programación</option>
                    <option value="Diseño">Diseño</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Imagen de portada (URL)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="https://..."
                    value={cursoSeleccionado.imagenPortada || ""}
                    onChange={(e) =>
                      setCursoSeleccionado({ ...cursoSeleccionado, imagenPortada: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModalEditar(false)}>
              Cancelar
            </Button>
            <Button variant="dark" onClick={editarCurso}>
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast bg={tipoToast} onClose={() => setMostrarToast(false)} show={mostrarToast} delay={2500} autohide>
            <Toast.Body className="text-white fw-semibold">{mensajeToast}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default PanelAdministrador;
