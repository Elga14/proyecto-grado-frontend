import { useEffect, useState } from "react";
import { Container, Alert } from "react-bootstrap";
import TarjetaCurso from "../componentes/TarjetaCurso";

function Inicio() {
  const [cursos, setCursos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Obtener cursos disponibles
  useEffect(() => {
    const obtenerCursos = async () => {
      try {
        const respuesta = await fetch("http://localhost:5000/api/cursos");
        const datos = await respuesta.json();

        if (respuesta.ok) {
          setCursos(datos);
        } else {
          console.error("Error al obtener cursos");
          setMensaje("Error al cargar cursos");
        }
      } catch (error) {
        console.error("Error al cargar cursos:", error);
        setMensaje("Error al comunicarse con el servidor");
      }
    };

    obtenerCursos();
  }, []);

  return (
    <Container className="py-5">
      {/* Sección de bienvenida */}
      <div className="mb-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold">¡Bienvenido! 👋</h1>
          <p className="text-muted">Explora nuestros cursos disponibles</p>
        </div>
      </div>

      {/* Sección de cursos */}
      <div>
        <h2 className="mb-4 fw-bold">Cursos Disponibles</h2>

        {/* Grid de cursos */}
        {cursos.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {cursos.map((curso) => (
              <div className="col" key={curso._id}>
                <TarjetaCurso curso={curso} />
              </div>
            ))}
          </div>
        ) : (
          <Alert variant="info" className="text-center">
            No hay cursos disponibles en este momento.
          </Alert>
        )}

        {/* Mensaje de error */}
        {mensaje && (
          <Alert variant="danger" className="text-center mt-3">
            {mensaje}
          </Alert>
        )}
      </div>
    </Container>
  );
}

export default Inicio;
