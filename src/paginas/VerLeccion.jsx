import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

const LessonView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams(); // id del curso

  // -------------------------------------------------------------
  // 1️⃣ Verificar compra del curso (aunque luego lo desactivemos)
  // -------------------------------------------------------------
  useEffect(() => {
    const verificarCompra = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate(`/curso/${id}`);

        const respuesta = await axios.get(
          "http://localhost:5000/api/orders/mis-cursos",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const comprado = respuesta.data.some((curso) => curso._id === id);

        if (!comprado) navigate(`/curso/${id}`);
      } catch (error) {
        console.error("Error verificando compra:", error);
        navigate(`/curso/${id}`);
      }
    };

    verificarCompra();
  }, [id, navigate]);

  // -------------------------------------------------------------
  // 2️⃣ Aviso si no llega la información de la lección
  // -------------------------------------------------------------
  if (!state || !state.lesson) {
    return (
      <Container className="py-5 text-center">
        <h4>⚠️ No se pudo cargar la lección.</h4>

        <Button
          variant="dark"
          onClick={() => navigate(`/curso/${id}/contenido`)}
        >
          Volver al contenido
        </Button>
      </Container>
    );
  }

  const { lesson } = state;

  // -------------------------------------------------------------
  // 3️⃣ Vista de la lección
  // -------------------------------------------------------------
  return (
    <Container className="py-5">
      <Card className="shadow p-4" style={{ borderRadius: "15px" }}>
        <h2 className="fw-bold mb-3 text-center">
          {lesson.tituloLeccion}
        </h2>

        <div className="mt-4">

          {/* VIDEO */}
          {lesson.tipo === "video" && (
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                src={
                  lesson.videoUrl.includes("youtube.com/watch")
                    ? lesson.videoUrl.replace("watch?v=", "embed/")
                    : lesson.videoUrl
                }
                title={lesson.tituloLeccion}
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* IMAGEN */}
          {lesson.tipo === "imagen" && (
            <img
              src={lesson.imagenUrl}
              alt={lesson.tituloLeccion}
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "20px"
              }}
            />
          )}

          {/* PDF */}
          {lesson.tipo === "pdf" && (
            <iframe
              src={lesson.archivoUrl}
              title="PDF Viewer"
              style={{
                width: "100%",
                height: "600px",
                borderRadius: "10px"
              }}
            ></iframe>
          )}

          {/* TEXTO */}
          {(lesson.tipo === "texto" || lesson.contenidoTexto) && (
            <p className="mt-3 fs-5">{lesson.contenidoTexto}</p>
          )}
        </div>

        <div className="text-center mt-4">
          <Button
            variant="dark"
            onClick={() => navigate(`/curso/${id}/contenido`)}
          >
            Volver al contenido
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default LessonView;
