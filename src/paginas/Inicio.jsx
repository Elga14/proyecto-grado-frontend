import { useEffect, useState } from "react";

function Inicio() {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const obtenerPerfil = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMensaje("No tienes acceso. Inicia sesión.");
        return;
      }

      try {
        const respuesta = await fetch("http://localhost:5000/api/usuarios/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          setMensaje(datos.mensaje || "Acceso no autorizado");
          return;
        }

        setUsuario(datos.datos);

        }
        catch (error) {
        console.error("Error en la solicitud:", error);
        setMensaje("Error al comunicarse con el servidor");
      }  

    };

    obtenerPerfil();
  }, []);

  return (
    <div>
        <h1>Bienvenido a la página de inicio</h1>

      {mensaje && <p>{mensaje}</p>}

      {usuario && (
        <div>
          <h3>Bienvenido, {usuario.nombre}</h3>
          <p>Correo: {usuario.correo}</p>
        </div>
      )}
    </div>
  );
}

export default Inicio;
