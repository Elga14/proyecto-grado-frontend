import { useState } from "react";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const respuesta = await fetch("http://localhost:5000/api/usuarios/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          correo,
          contraseña
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        return setMensaje(datos.mensaje || "Error al registrar usuario");
      }

      setMensaje("Usuario registrado correctamente");

      // Resetear formulario
      setNombre("");
      setCorreo("");
      setContraseña("");

    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>

      <form onSubmit={manejarRegistro}>

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

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

        <button type="submit">Registrarme</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Registro;
