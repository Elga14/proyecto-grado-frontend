import React, { createContext, useState, useEffect } from "react";

// Crear contexto
export const ContextoCarrito = createContext();

// Proveedor del contexto
export const ProveedorCarrito = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Agregar curso al carrito
  const agregarAlCarrito = (curso) => {
    setCarrito((prev) => {
      const existe = prev.some((item) => item._id === curso._id);
      if (!existe) {
        const actualizado = [...prev, curso];
        return actualizado;
      } else {
        alert("Este curso ya está en el carrito.");
        return prev;
      }
    });
  };

  // Eliminar curso
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item._id !== id));
  };

  // Vaciar carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <ContextoCarrito.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito }}
    >
      {children}
    </ContextoCarrito.Provider>
  );
};
