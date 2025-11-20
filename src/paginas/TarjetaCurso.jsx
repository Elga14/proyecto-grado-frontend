import React from "react";
import { useNavigate } from "react-router-dom";

const TarjetaCurso = ({ curso }) => {
  const navigate = useNavigate();

  return (
    <div className="card h-100 shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
      {/* Imagen del curso */}
      <img
        src={curso.imagenPortada || "https://via.placeholder.com/400x250?text=Sin+imagen"}
        alt={curso.titulo}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        {/* Categoría */}
        <span className="badge bg-primary mb-2 align-self-start">
          {curso.categoria}
        </span>

        {/* Título del curso */}
        <h5 className="card-title fw-bold">{curso.titulo}</h5>

        {/* Descripción truncada */}
        <p className="card-text text-muted flex-grow-1">
          {curso.descripcion.length > 100
            ? `${curso.descripcion.substring(0, 100)}...`
            : curso.descripcion}
        </p>

        {/* Información adicional */}
        <div className="mb-3">
          <small className="text-muted d-block">
            <strong>📊 Nivel:</strong> {curso.nivel}
          </small>
          <small className="text-muted d-block">
            <strong>⏱️ Duración:</strong> {curso.duracion}
          </small>
        </div>

        {/* Precio y botón */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="fs-5 fw-bold text-success">${curso.precio}</span>
          <button
            className="btn btn-dark"
            onClick={() => navigate(`/curso/${curso._id}`)}
          >
            Ver Curso
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaCurso;