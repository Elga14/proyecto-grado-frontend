import React, { useEffect, useState } from "react";
import { Card, Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MisCursos = () => {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCursosComprados = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const respuesta = await axios.get(
          "http://localhost:5000/api/pedidos/mis-cursos",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCursos(respuesta.data);
      } catch (error) {
        console.error("❌ Error al cargar los cursos comprados:", error);
      }
    };

    cargarCursosComprados();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="fw-bold mb-4">📘 Mis Cursos</h2>

      {cursos.length === 0 && (
        <p className="text-center">Aún no has comprado ningún curso.</p>
      )}

      <div className="d-flex flex-wrap gap-4">
        {cursos.map((curso) => (
          <Card key={curso._id} style={{ width: "300px" }} className="shadow">
            <Card.Img
              variant="top"
              src={curso.imagenPortada || "https://via.placeholder.com/300"}
              style={{ height: "180px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{curso.titulo}</Card.Title>
              <Button
                variant="dark"
                className="w-100 mt-3"
                onClick={() => navigate(`/curso/${curso._id}/contenido`)}
              >
                Ir al curso →
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default MisCursos;
