import { useState } from "react";

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    zona: "",
  });

  const [nuevoPedido, setNuevoPedido] = useState({
    cliente: "",
    dia: "Martes",
    cantidad: 2,
  });

  const agregarCliente = () => {
    if (
      nuevoCliente.nombre.trim() === "" ||
      nuevoCliente.telefono.trim() === "" ||
      nuevoCliente.direccion.trim() === "" ||
      nuevoCliente.zona.trim() === ""
    ) {
      alert("Completa todos los datos del cliente");
      return;
    }

    setClientes([...clientes, nuevoCliente]);

    setNuevoCliente({
      nombre: "",
      telefono: "",
      direccion: "",
      zona: "",
    });
  };

  const agregarPedido = () => {
    if (nuevoPedido.cliente === "") {
      alert("Selecciona un cliente");
      return;
    }

    if (Number(nuevoPedido.cantidad) < 2) {
      alert("El pedido mínimo es de 2 conos");
      return;
    }

    setPedidos([...pedidos, nuevoPedido]);

    setNuevoPedido({
      cliente: "",
      dia: "Martes",
      cantidad: 2,
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🐔 Granja La Lomita</h1>
      <p style={styles.subtitle}>Pedidos y clientes</p>

      <div style={styles.card}>
        <h2>Agregar cliente</h2>

        <input
          style={styles.input}
          placeholder="Nombre"
          value={nuevoCliente.nombre}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Teléfono"
          value={nuevoCliente.telefono}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Dirección"
          value={nuevoCliente.direccion}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Zona"
          value={nuevoCliente.zona}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, zona: e.target.value })
          }
        />

        <button style={styles.greenButton} onClick={agregarCliente}>
          Guardar cliente
        </button>
      </div>

      <div style={styles.card}>
        <h2>Nuevo pedido</h2>

        <select
          style={styles.input}
          value={nuevoPedido.cliente}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, cliente: e.target.value })
          }
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map((cliente, index) => (
            <option key={index} value={cliente.nombre}>
              {cliente.nombre}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          value={nuevoPedido.dia}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, dia: e.target.value })
          }
        >
          <option value="Martes">Martes</option>
          <option value="Jueves">Jueves</option>
          <option value="Sábado">Sábado</option>
        </select>

        <input
          style={styles.input}
          type="number"
          min="2"
          placeholder="Cantidad de conos"
          value={nuevoPedido.cantidad}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, cantidad: e.target.value })
          }
        />

        <button style={styles.yellowButton} onClick={agregarPedido}>
          Agregar pedido
        </button>
      </div>

      <div style={styles.card}>
        <h2>Clientes registrados</h2>
        {clientes.length === 0 ? (
          <p>No hay clientes todavía</p>
        ) : (
          clientes.map((cliente, index) => (
            <div key={index} style={styles.itemBox}>
              <p>
                <strong>Nombre:</strong> {cliente.nombre}
              </p>
              <p>
                <strong>Teléfono:</strong> {cliente.telefono}
              </p>
              <p>
                <strong>Dirección:</strong> {cliente.direccion}
              </p>
              <p>
                <strong>Zona:</strong> {cliente.zona}
              </p>
            </div>
          ))
        )}
      </div>

      <div style={styles.card}>
        <h2>Pedidos</h2>
        {pedidos.length === 0 ? (
          <p>No hay pedidos todavía</p>
        ) : (
          pedidos.map((pedido, index) => (
            <div key={index} style={styles.itemBox}>
              <p>
                <strong>Cliente:</strong> {pedido.cliente}
              </p>
              <p>
                <strong>Día:</strong> {pedido.dia}
              </p>
              <p>
                <strong>Conos:</strong> {pedido.cantidad}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f7f7",
  },
  title: {
    textAlign: "center",
    marginBottom: "5px",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  greenButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  yellowButton: {
    backgroundColor: "#f9a825",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  itemBox: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    backgroundColor: "#fafafa",
  },
};
