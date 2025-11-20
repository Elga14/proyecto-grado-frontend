import { useEffect, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import TarjetaCurso from "../componentes/TarjetaCurso";

function Inicio() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [cargandoCursos, setCargandoCursos] = useState(true);

  // Obtener perfil del usuario
  useEffect(() => {
    const obtenerPerfil = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMensaje("No tienes acceso. Inicia sesión.");
        setCargando(false);
        return;
      }

      try {
        const respuesta = await fetch("http://localhost:5000/api/usuarios/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          setMensaje(datos.mensaje || "Acceso no autorizado");
          setCargando(false);
          return;
        }

        setUsuario(datos.usuario || null);
      } catch (error) {
        console.error("Error en la solicitud:", error);
        setMensaje("Error al comunicarse con el servidor");
      }

      setCargando(false);
    };

    obtenerPerfil();
  }, []);

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
        }
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      } finally {
        setCargandoCursos(false);
      }
    };

    obtenerCursos();
  }, []);

  return (
    <Container className="py-5">
      {/* Sección de bienvenida */}
      <div className="mb-5">
        {/* Mensaje de carga */}
        {cargando && (
          <div className="text-center mb-3">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Cargando información...</p>
          </div>
        )}

        {/* Mensajes de error */}
        {!cargando && mensaje && (
          <Alert variant="danger" className="text-center">
            {mensaje}
          </Alert>
        )}

        {/* Saludo al usuario */}
        {!cargando && usuario && usuario.nombre && (
          <div className="text-center mb-4">
            <h1 className="display-5 fw-bold">¡Bienvenido, {usuario.nombre}! 👋</h1>
            <p className="text-muted">Explora nuestros cursos disponibles</p>
          </div>
        )}
      </div>

      {/* Sección de cursos */}
      <div>
        <h2 className="mb-4 fw-bold">Cursos Disponibles</h2>

        {/* Spinner de carga de cursos */}
        {cargandoCursos && (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Cargando cursos...</p>
          </div>
        )}

        {/* Grid de cursos */}
        {!cargandoCursos && cursos.length > 0 && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {cursos.map((curso) => (
              <div className="col" key={curso._id}>
                <TarjetaCurso curso={curso} />
              </div>
            ))}
          </div>
        )}

        {/* Mensaje si no hay cursos */}
        {!cargandoCursos && cursos.length === 0 && (
          <Alert variant="info" className="text-center">
            No hay cursos disponibles en este momento.
          </Alert>
        )}
      </div>
    </Container>
  );
}

export default Inicio;