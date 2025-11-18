import { useEffect, useState } from "react";

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

  if (cargando) return <p>Cargando perfil...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      <p><strong>Nombre:</strong> {datos.nombre}</p>
      <p><strong>Correo:</strong> {datos.correo}</p>
      <p><strong>Rol:</strong> {datos.rol}</p>
    </div>
  );
}

export default Perfil;
