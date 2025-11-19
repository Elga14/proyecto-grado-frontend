/**
 * Inicio.jsx
 * Página principal de los cursos para los usuarios
 */

import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TarjetaCurso from "../componentes/TarjetaCurso";

function Inicio() {
  const [cursos, setCursos] = useState([]);

  // Obtener cursos del backend
  const obtenerCursos = async () => {
    try {
      const respuesta = await fetch("http://localhost:5000/api/cursos");
      const data = await respuesta.json();
      setCursos(data.cursos);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    }
  };

  useEffect(() => {
    obtenerCursos();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Cursos disponibles</h2>

      <Row>
        {cursos.length === 0 ? (
          <p>No hay cursos disponibles aún.</p>
        ) : (
          cursos.map((curso) => (
            <Col key={curso._id} md={4} className="mb-4">
              <TarjetaCurso curso={curso} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default Inicio;
