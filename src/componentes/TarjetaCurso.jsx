/**
 * TarjetaCurso.jsx
 *
 * Tarjeta visual para mostrar los cursos al usuario en el inicio.
 * Todo en español, manteniendo la lógica.
 */

import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function TarjetaCurso({ curso }) {

  const navigate = useNavigate();

  // Formatear precio en pesos colombianos
  const formatoPesos = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // 👉 Agregar al carrito (guardado en localStorage)
  const agregarCarrito = () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Evitar duplicados
    const existe = carrito.find(item => item._id === curso._id);
    if (!existe) {
      carrito.push(curso);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert("Curso agregado al carrito ✔️");
    } else {
      alert("Este curso ya está en el carrito.");
    }
  };

  return (
    <Card className="shadow-sm h-100">
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

          <div className="d-flex gap-2">
            <Button variant="dark" onClick={() => navigate(`/curso/${curso._id}`)}>
              Ver curso
            </Button>

            {/* 👉 Botón Agregar al carrito */}
            <Button variant="success" onClick={agregarCarrito}>
              Agregar
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TarjetaCurso;
