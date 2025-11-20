import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DetallesCurso = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCurso = async () => {
      try {
        setCargando(true);
        setError(null);

        // Obtener información del curso desde el backend
        const respuesta = await axios.get(`http://localhost:5000/api/cursos/${id}`);
        setCurso(respuesta.data);

      } catch (error) {
        console.error("Error al obtener el curso:", error);
        setError("No se pudo cargar el curso. Por favor intenta de nuevo.");
      } finally {
        setCargando(false);
      }
    };

    obtenerCurso();
  }, [id]);

  // Mostrar spinner mientras carga
  if (cargando) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  // Mostrar mensaje si no se encuentra el curso
  if (!curso) {
    return (
      <div className="container text-center mt-5">
        <p className="fs-4">No se encontró el curso.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "2rem", paddingBottom: "2rem" }}>
      <div className="card p-4 shadow" style={{ maxWidth: "700px", width: "100%", borderRadius: "15px" }}>
        
        {/* Imagen del curso */}
        <img
          src={curso.imagenPortada || "https://via.placeholder.com/600x400?text=Sin+imagen"}
          alt={curso.titulo}
          className="card-img-top"
          style={{
            height: "350px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />

        <div className="card-body">
          {/* Título del curso */}
          <h2 className="card-title fw-bold text-center mb-3">{curso.titulo}</h2>
          
          {/* Descripción */}
          <p className="card-text text-muted mb-4">{curso.descripcion}</p>

          {/* Información del curso */}
          <div className="row mb-4">
            <div className="col-md-6">
              <p><strong>📚 Categoría:</strong> {curso.categoria}</p>
              <p><strong>📊 Nivel:</strong> {curso.nivel}</p>
            </div>
            <div className="col-md-6">
              <p><strong>⏱️ Duración:</strong> {curso.duracion}</p>
              <p><strong>💰 Precio:</strong> ${curso.precio}</p>
            </div>
          </div>

          {/* Información del instructor si existe */}
          {curso.instructor && (
            <div className="alert alert-info" role="alert">
              <strong>👨‍🏫 Instructor:</strong> {curso.instructor.nombre} ({curso.instructor.email})
            </div>
          )}

          {/* Botones de acción */}
          <div className="d-grid gap-2">
            <button
              className="btn btn-dark btn-lg"
              onClick={() => navigate(`/curso/${id}/contenido`)}
            >
              📖 Ver contenido del curso
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesCurso;