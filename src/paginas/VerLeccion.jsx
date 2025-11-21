import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import axios from "axios";

const VerLeccion = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams(); // id = curso

  // Verificar que el curso haya sido comprado
  useEffect(() => {
    const verificarCompra = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate(`/curso/${id}`);

        const respuesta = await axios.get(
          "http://localhost:5000/api/pedidos/mis-cursos",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const comprado = respuesta.data.some((c) => c._id === id);
        if (!comprado) navigate(`/curso/${id}`);
      } catch (error) {
        console.error("Error verificando compra:", error);
        navigate(`/curso/${id}`);
      }
    };

    verificarCompra();
  }, [id, navigate]);

  // Si no llega la lección
  if (!state || !state.leccion) {
    return (
      <Container className="py-5 text-center">
        <h4>⚠️ No se pudo cargar la lección.</h4>
        <Button variant="dark" onClick={() => navigate(`/curso/${id}/contenido`)}>
          Volver al contenido
        </Button>
      </Container>
    );
  }

  const { leccion } = state;

  return (
    <Container className="py-5">
      <Card className="shadow p-4" style={{ borderRadius: "15px" }}>
        <h2 className="fw-bold mb-3 text-center">{leccion.tituloLeccion}</h2>

        <div className="mt-4">
          {leccion.tipo === "video" && leccion.videoUrl && (
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                src={
                  leccion.videoUrl.includes("youtube.com/watch")
                    ? leccion.videoUrl.replace("watch?v=", "embed/")
                    : leccion.videoUrl
                }
                title={leccion.tituloLeccion}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {leccion.tipo === "imagen" && (
            <img
              src={leccion.imagenUrl}
              alt={leccion.tituloLeccion}
              style={{ width: "100%", borderRadius: "10px", marginBottom: "20px" }}
            />
          )}

          {leccion.tipo === "pdf" && (
            <iframe
              src={leccion.archivoUrl}
              title="PDF Viewer"
              style={{ width: "100%", height: "600px", borderRadius: "10px" }}
            ></iframe>
          )}

          {(leccion.tipo === "texto" || leccion.contenidoTexto) && (
            <p className="mt-3 fs-5">{leccion.contenidoTexto}</p>
          )}
        </div>

        <div className="text-center mt-4">
          <Button variant="dark" onClick={() => navigate(`/curso/${id}/contenido`)}>
            Volver al contenido
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default VerLeccion;
