import { useState } from "react";
import { useNavigate } from "react-router-dom";

function IniciarSesion() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navegar = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const respuesta = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contraseña }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        return setMensaje(datos.mensaje || "Error al iniciar sesión");
      }

      // Guardar token en el navegador
      localStorage.setItem("token", datos.token);

      setMensaje("Inicio de sesión exitoso");

      // Redirigir a la página de inicio
      navegar("/inicio");

    } catch (error) {
      console.error(error);
      setMensaje("No se puede conectar con el servidor");
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>

      <form onSubmit={manejarLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default IniciarSesion;
