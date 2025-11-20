import { useEffect, useState } from "react";
import { Container, Card, Alert, Spinner } from "react-bootstrap";

function Inicio() {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

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

        // Ajuste importante: usar la propiedad correcta devuelta por el backend
        setUsuario(datos.usuario || null);
      } catch (error) {
        console.error("Error en la solicitud:", error);
        setMensaje("Error al comunicarse con el servidor");
      }

      setCargando(false);
    };

    obtenerPerfil();
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "450px" }} className="shadow p-4">

        <h2 className="text-center mb-4">Página de Inicio</h2>

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

        {/* Información del usuario */}
        {!cargando && usuario && usuario.nombre && (
          <div>
            <Alert variant="success" className="text-center">
              ¡Bienvenido, {usuario.nombre}!
            </Alert>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>Rol:</strong> {usuario.rol}</p>
          </div>
        )}

      </Card>
    </Container>
  );
}

export default Inicio;
