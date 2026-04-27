import { useEffect, useMemo, useState } from "react";

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [cortes, setCortes] = useState([]);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    zona: "",
  });

  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: "",
    total: "",
    metodo: "Efectivo",
  });

  const [nuevoGasto, setNuevoGasto] = useState({
    concepto: "Alimento",
    monto: "",
    metodo: "Efectivo",
  });

  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostrarVentas, setMostrarVentas] = useState(false);
  const [mostrarGastos, setMostrarGastos] = useState(false);
  const [mostrarCortes, setMostrarCortes] = useState(false);

  const [buscarCliente, setBuscarCliente] = useState("");

  useEffect(() => {
    const clientesGuardados = localStorage.getItem("clientes");
    const ventasGuardadas = localStorage.getItem("ventas");
    const gastosGuardados = localStorage.getItem("gastos");
    const cortesGuardados = localStorage.getItem("cortes");

    if (clientesGuardados) setClientes(JSON.parse(clientesGuardados));
    if (ventasGuardadas) setVentas(JSON.parse(ventasGuardadas));
    if (gastosGuardados) setGastos(JSON.parse(gastosGuardados));
    if (cortesGuardados) setCortes(JSON.parse(cortesGuardados));
  }, []);

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem("cortes", JSON.stringify(cortes));
  }, [cortes]);

  const clientesOrdenados = useMemo(() => {
    return [...clientes].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );
  }, [clientes]);

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

  const guardarGasto = () => {
    if (
      nuevoGasto.concepto.trim() === "" ||
      nuevoGasto.monto.toString().trim() === ""
    ) {
      alert("Completa concepto y monto del gasto");
      return;
    }

    setGastos([
      ...gastos,
      {
        id: Date.now(),
        concepto: nuevoGasto.concepto,
        monto: Number(nuevoGasto.monto),
        metodo: nuevoGasto.metodo,
        fecha: new Date().toLocaleString(),
      },
    ]);

    setNuevoGasto({
      concepto: "Alimento",
      monto: "",
      metodo: "Efectivo",
    });
  };

  const eliminarCliente = (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este cliente?")) return;
    setClientes(clientes.filter((cliente) => cliente.id !== id));
  };

  const eliminarVenta = (id) => {
    if (!window.confirm("¿Seguro que deseas borrar esta venta?")) return;
    setVentas(ventas.filter((venta) => venta.id !== id));
  };

  const eliminarGasto = (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este gasto?")) return;
    setGastos(gastos.filter((gasto) => gasto.id !== id));
  };

  const eliminarCorte = (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este corte histórico?")) return;
    setCortes(cortes.filter((corte) => corte.id !== id));
  };

  const ventaBruta = useMemo(() => {
    return ventas.reduce((acum, venta) => acum + Number(venta.total || 0), 0);
  }, [ventas]);

  const totalGastos = useMemo(() => {
    return gastos.reduce((acum, gasto) => acum + Number(gasto.monto || 0), 0);
  }, [gastos]);

  const utilidadNeta = useMemo(() => {
    return ventaBruta - totalGastos;
  }, [ventaBruta, totalGastos]);

  const cerrarCorteSemanal = () => {
    if (ventas.length === 0 && gastos.length === 0) {
      alert("No hay ventas ni gastos para cerrar corte");
      return;
    }

    const confirmar = window.confirm(
      "¿Cerrar corte semanal? Las ventas y gastos actuales se irán al historial y la semana nueva empezará desde cero."
    );

    if (!confirmar) return;

    const nuevoCorte = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      ventas,
      gastos,
      ventaBruta,
      totalGastos,
      utilidadNeta,
    };

    setCortes([nuevoCorte, ...cortes]);
    setVentas([]);
    setGastos([]);
  };

  const clientesFiltrados = useMemo(() => {
    return clientesOrdenados.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(buscarCliente.toLowerCase())
    );
  }, [clientesOrdenados, buscarCliente]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🐔 Granja La Lomita</h1>
      <p style={styles.subtitle}>Sistema semanal de clientes, ventas y gastos</p>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Venta bruta semana actual</div>
          <div style={styles.summaryValue}>${ventaBruta}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Gastos semana actual</div>
          <div style={styles.summaryValue}>${totalGastos}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Utilidad neta semana actual</div>
          <div style={styles.summaryValue}>${utilidadNeta}</div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Cerrar corte semanal</h2>
        <p style={styles.note}>
          Al cerrar el corte, las ventas y gastos actuales se guardan en historial
          y la semana nueva empieza desde cero.
        </p>
        <button style={styles.blackButton} onClick={cerrarCorteSemanal}>
          Cerrar corte semanal
        </button>
      </div>

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
        <h2 style={styles.sectionTitle}>Registrar venta</h2>

        <select
          style={styles.input}
          value={nuevaVenta.cliente}
          onChange={(e) =>
            setNuevaVenta({ ...nuevaVenta, cliente: e.target.value })
          }
        >
          <option value="">Selecciona un cliente</option>
          {clientesOrdenados.map((cliente) => (
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
        <h2 style={styles.sectionTitle}>Registrar gasto</h2>

        <select
          style={styles.input}
          value={nuevoGasto.concepto}
          onChange={(e) =>
            setNuevoGasto({ ...nuevoGasto, concepto: e.target.value })
          }
        >
          <option value="Alimento">Alimento</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Nono">Nono</option>
          <option value="Mamá">Mamá</option>
          <option value="Papá">Papá</option>
          <option value="Tío Mario">Tío Mario</option>
          <option value="Etiquetas">Etiquetas</option>
          <option value="Verduras">Verduras</option>
          <option value="Vitafort">Vitafort</option>
          <option value="Doceneras">Doceneras</option>
          <option value="Paca de trigo">Paca de trigo</option>
          <option value="Pastillas para perros">Pastillas para perros</option>
          <option value="Propina">Propina</option>
          <option value="Otro">Otro</option>
        </select>

        <input
          style={styles.input}
          type="number"
          placeholder="Monto del gasto"
          value={nuevoGasto.monto}
          onChange={(e) =>
            setNuevoGasto({ ...nuevoGasto, monto: e.target.value })
          }
        />

        <select
          style={styles.input}
          value={nuevoGasto.metodo}
          onChange={(e) =>
            setNuevoGasto({ ...nuevoGasto, metodo: e.target.value })
          }
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
        </select>

        <button style={styles.redButton} onClick={guardarGasto}>
          Guardar gasto
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
        <button
          style={styles.folderButton}
          onClick={() => setMostrarVentas(!mostrarVentas)}
        >
          <span>📁 Ventas semana actual</span>
          <span>{mostrarVentas ? "▲" : "▼"}</span>
        </button>

        {mostrarVentas && (
          <>
            <div style={styles.totalBox}>
              <strong>Venta bruta semana actual:</strong> ${ventaBruta}
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

      <div style={styles.card}>
        <button
          style={styles.folderButton}
          onClick={() => setMostrarGastos(!mostrarGastos)}
        >
          <span>📁 Gastos semana actual</span>
          <span>{mostrarGastos ? "▲" : "▼"}</span>
        </button>

        {mostrarGastos && (
          <>
            <div style={styles.totalBoxRed}>
              <strong>Gastos semana actual:</strong> ${totalGastos}
            </div>

            {gastos.length === 0 ? (
              <p>No hay gastos todavía</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Concepto</th>
                      <th style={styles.th}>Monto</th>
                      <th style={styles.th}>Método</th>
                      <th style={styles.th}>Fecha</th>
                      <th style={styles.th}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastos.map((gasto) => (
                      <tr key={gasto.id}>
                        <td style={styles.td}>{gasto.concepto}</td>
                        <td style={styles.td}>${gasto.monto}</td>
                        <td style={styles.td}>{gasto.metodo}</td>
                        <td style={styles.td}>{gasto.fecha}</td>
                        <td style={styles.td}>
                          <button
                            style={styles.deleteButton}
                            onClick={() => eliminarGasto(gasto.id)}
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
        <button
          style={styles.folderButton}
          onClick={() => setMostrarCortes(!mostrarCortes)}
        >
          <span>📁 Historial de cortes anteriores</span>
          <span>{mostrarCortes ? "▲" : "▼"}</span>
        </button>

        {mostrarCortes && (
          <>
            {cortes.length === 0 ? (
              <p>No hay cortes cerrados todavía</p>
            ) : (
              cortes.map((corte) => (
                <div key={corte.id} style={styles.cutBox}>
                  <h3>Corte cerrado</h3>
                  <p><strong>Fecha:</strong> {corte.fecha}</p>
                  <p><strong>Venta bruta:</strong> ${corte.ventaBruta}</p>
                  <p><strong>Gastos:</strong> ${corte.totalGastos}</p>
                  <p><strong>Utilidad neta:</strong> ${corte.utilidadNeta}</p>

                  <button
                    style={styles.deleteButton}
                    onClick={() => eliminarCorte(corte.id)}
                  >
                    Borrar corte
                  </button>
                </div>
              ))
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
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  summaryLabel: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "8px",
  },
  summaryValue: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
  },
  note: {
    color: "#555",
    marginBottom: "14px",
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
  blueButton: {
    backgroundColor: "#1565c0",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  redButton: {
    backgroundColor: "#b71c1c",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  blackButton: {
    backgroundColor: "#111827",
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
  totalBoxRed: {
    backgroundColor: "#ffebee",
    color: "#b71c1c",
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
  cutBox: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "12px",
    backgroundColor: "#fafafa",
  },
};
