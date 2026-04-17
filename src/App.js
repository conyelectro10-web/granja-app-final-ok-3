import { useEffect, useMemo, useState } from "react";

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [ventas, setVentas] = useState([]);

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

  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: "",
    total: "",
    metodo: "Efectivo",
  });

  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostrarVentas, setMostrarVentas] = useState(false);
  const [buscarCliente, setBuscarCliente] = useState("");

  useEffect(() => {
    const clientesGuardados = localStorage.getItem("clientes");
    const pedidosGuardados = localStorage.getItem("pedidos");
    const ventasGuardadas = localStorage.getItem("ventas");

    if (clientesGuardados) setClientes(JSON.parse(clientesGuardados));
    if (pedidosGuardados) setPedidos(JSON.parse(pedidosGuardados));
    if (ventasGuardadas) setVentas(JSON.parse(ventasGuardadas));
  }, []);

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

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

    setClientes([
      ...clientes,
      {
        id: Date.now(),
        ...nuevoCliente,
      },
    ]);

    setNuevoCliente({
      nombre: "",
      telefono: "",
      direccion: "",
      zona: "",
    });
  };

  const agregarPedido = () => {
    if (nuevoPedido.cliente.trim() === "") {
      alert("Selecciona un cliente");
      return;
    }

    setPedidos([
      ...pedidos,
      {
        id: Date.now(),
        ...nuevoPedido,
      },
    ]);

    setNuevoPedido({
      cliente: "",
      dia: "Martes",
      cantidad: 2,
    });
  };

  const guardarVenta = () => {
    if (
      nuevaVenta.cliente.trim() === "" ||
      nuevaVenta.total.toString().trim() === ""
    ) {
      alert("Completa cliente y total de la venta");
      return;
    }

    setVentas([
      ...ventas,
      {
        id: Date.now(),
        cliente: nuevaVenta.cliente,
        total: Number(nuevaVenta.total),
        metodo: nuevaVenta.metodo,
        fecha: new Date().toLocaleString(),
      },
    ]);

    setNuevaVenta({
      cliente: "",
      total: "",
      metodo: "Efectivo",
    });
  };

  const eliminarCliente = (id) => {
    const confirmar = window.confirm("¿Seguro que deseas borrar este cliente?");
    if (!confirmar) return;

    setClientes(clientes.filter((cliente) => cliente.id !== id));
  };

  const eliminarPedido = (id) => {
    const confirmar = window.confirm("¿Seguro que deseas borrar este pedido?");
    if (!confirmar) return;

    setPedidos(pedidos.filter((pedido) => pedido.id !== id));
  };

  const eliminarVenta = (id) => {
    const confirmar = window.confirm("¿Seguro que deseas borrar esta venta?");
    if (!confirmar) return;

    setVentas(ventas.filter((venta) => venta.id !== id));
  };

  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(buscarCliente.toLowerCase())
    );
  }, [clientes, buscarCliente]);

  const ventaBruta = useMemo(() => {
    return ventas.reduce((acum, venta) => acum + Number(venta.total || 0), 0);
  }, [ventas]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🐔 Granja La Lomita</h1>
      <p style={styles.subtitle}>Pedidos, clientes y ventas</p>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Agregar cliente</h2>

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
        <h2 style={styles.sectionTitle}>Nuevo pedido</h2>

        <select
          style={styles.input}
          value={nuevoPedido.cliente}
          onChange={(e) =>
            setNuevoPedido({ ...nuevoPedido, cliente: e.target.value })
          }
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.nombre}>
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
        <h2 style={styles.sectionTitle}>Registrar venta</h2>

        <select
          style={styles.input}
          value={nuevaVenta.cliente}
          onChange={(e) =>
            setNuevaVenta({ ...nuevaVenta, cliente: e.target.value })
          }
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.nombre}>
              {cliente.nombre}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          type="number"
          placeholder="Total de la venta"
          value={nuevaVenta.total}
          onChange={(e) =>
            setNuevaVenta({ ...nuevaVenta, total: e.target.value })
          }
        />

        <select
          style={styles.input}
          value={nuevaVenta.metodo}
          onChange={(e) =>
            setNuevaVenta({ ...nuevaVenta, metodo: e.target.value })
          }
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
        </select>

        <button style={styles.blueButton} onClick={guardarVenta}>
          Guardar venta
        </button>
      </div>

      <div style={styles.card}>
        <button
          style={styles.folderButton}
          onClick={() => setMostrarClientes(!mostrarClientes)}
        >
          <span>📁 Clientes registrados</span>
          <span>{mostrarClientes ? "▲" : "▼"}</span>
        </button>

        {mostrarClientes && (
          <>
            <input
              style={styles.input}
              placeholder="Buscar cliente por nombre..."
              value={buscarCliente}
              onChange={(e) => setBuscarCliente(e.target.value)}
            />

            {clientesFiltrados.length === 0 ? (
              <p>No hay clientes para mostrar</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Nombre</th>
                      <th style={styles.th}>Teléfono</th>
                      <th style={styles.th}>Dirección</th>
                      <th style={styles.th}>Zona</th>
                      <th style={styles.th}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id}>
                        <td style={styles.td}>{cliente.nombre}</td>
                        <td style={styles.td}>{cliente.telefono}</td>
                        <td style={styles.td}>{cliente.direccion}</td>
                        <td style={styles.td}>{cliente.zona}</td>
                        <td style={styles.td}>
                          <button
                            style={styles.deleteButton}
                            onClick={() => eliminarCliente(cliente.id)}
                          >
                            Borrar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Pedidos registrados</h2>

        {pedidos.length === 0 ? (
          <p>No hay pedidos todavía</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Día</th>
                  <th style={styles.th}>Conos</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td style={styles.td}>{pedido.cliente}</td>
                    <td style={styles.td}>{pedido.dia}</td>
                    <td style={styles.td}>{pedido.cantidad}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.deleteButton}
                        onClick={() => eliminarPedido(pedido.id)}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <button
          style={styles.folderButton}
          onClick={() => setMostrarVentas(!mostrarVentas)}
        >
          <span>📁 Ventas registradas</span>
          <span>{mostrarVentas ? "▲" : "▼"}</span>
        </button>

        {mostrarVentas && (
          <>
            <div style={styles.totalBox}>
              <strong>Venta bruta acumulada:</strong> ${ventaBruta}
            </div>

            {ventas.length === 0 ? (
              <p>No hay ventas todavía</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Cliente</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Método</th>
                      <th style={styles.th}>Fecha</th>
                      <th style={styles.th}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((venta) => (
                      <tr key={venta.id}>
                        <td style={styles.td}>{venta.cliente}</td>
                        <td style={styles.td}>${venta.total}</td>
                        <td style={styles.td}>{venta.metodo}</td>
                        <td style={styles.td}>{venta.fecha}</td>
                        <td style={styles.td}>
                          <button
                            style={styles.deleteButton}
                            onClick={() => eliminarVenta(venta.id)}
                          >
                            Borrar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "950px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f7f7",
  },
  title: {
    textAlign: "center",
    marginBottom: "5px",
    fontSize: "42px",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: "20px",
    fontSize: "18px",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "12px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontSize: "15px",
  },
  greenButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  yellowButton: {
    backgroundColor: "#f9a825",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  blueButton: {
    backgroundColor: "#1565c0",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  folderButton: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    border: "1px solid #dbe3ea",
    padding: "14px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "12px",
  },
  totalBox: {
    backgroundColor: "#e8f5e9",
    color: "#1b5e20",
    padding: "12px 14px",
    borderRadius: "8px",
    marginBottom: "14px",
    fontSize: "18px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f3f4f6",
    borderBottom: "2px solid #ddd",
    fontSize: "14px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    verticalAlign: "top",
  },
};
