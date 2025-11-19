import { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

function Perfil() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const respuesta = await fetch("http://localhost:5000/api/usuarios/perfil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          setError(resultado.mensaje || "Error al obtener el perfil");
          return;
        }

        setDatos(resultado.datos);
        
      } catch (error) {
        console.error("Error obteniendo perfil:", error);
        setError("No se pudo obtener el perfil.");
      } finally {
        setCargando(false);
      }
    };

    obtenerPerfil();
  }, [token]);

  if (cargando)
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Cargando perfil...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card style={{ width: "28rem" }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h2>Perfil del Usuario</h2>
          </Card.Title>

          <p><strong>Nombre:</strong> {datos.nombre}</p>
          <p><strong>Correo:</strong> {datos.correo}</p>
          <p><strong>Rol:</strong> {datos.rol}</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Perfil;
