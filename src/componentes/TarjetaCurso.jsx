/**
 * TarjetaCurso.jsx
 *
 * Tarjeta visual para mostrar los cursos al usuario en el inicio.
 * Solo visualización: imagen, título, descripción y precio.
 * Para más información se podría añadir un botón "Ver curso" luego.
 */

import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function TarjetaCurso({ curso }) {
  
  const navigate = useNavigate();

  // Formatear precio como pesos colombianos (COP)
  const formatoPesos = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <Card className="shadow-sm h-100">
      {/* Imagen del curso */}
      {curso.imagen ? (
        <Card.Img
          variant="top"
          src={curso.imagen}
          alt={curso.titulo}
          style={{ objectFit: "cover", height: "180px" }}
        />
      ) : (
        <div
          style={{
            height: "180px",
            backgroundColor: "#e9ecef",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#6c757d",
          }}
        >
          Sin imagen
        </div>
      )}

      <Card.Body>
        <Card.Title>{curso.titulo}</Card.Title>

        <Card.Text className="text-muted" style={{ minHeight: "70px" }}>
          {curso.descripcion?.slice(0, 100)}...
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center">
          <h6 className="fw-bold">{formatoPesos(curso.precio)}</h6>

          <Button variant="dark" onClick={() => navigate(`/curso/${curso._id}`)}>
  Ver curso
</Button>

        </div>
      </Card.Body>
    </Card>
  );
}

export default TarjetaCurso;
