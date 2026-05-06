import { useEffect, useMemo, useState } from "react";

export default function App() {
  const [ventas, setVentas] = useState([]);
  const [gastos, setGastos] = useState([]);

  const [nuevaVenta, setNuevaVenta] = useState({
    total: "",
    metodo: "Efectivo",
  });

  const [nuevoGasto, setNuevoGasto] = useState({
    concepto: "",
    monto: "",
    metodo: "Efectivo",
  });

  const [mostrarVentas, setMostrarVentas] = useState(false);
  const [mostrarGastos, setMostrarGastos] = useState(false);

  useEffect(() => {
    const ventasGuardadas = localStorage.getItem("ventas");
    const gastosGuardados = localStorage.getItem("gastos");

    if (ventasGuardadas) setVentas(JSON.parse(ventasGuardadas));
    if (gastosGuardados) setGastos(JSON.parse(gastosGuardados));
  }, []);

  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  const guardarVenta = () => {
    if (nuevaVenta.total.toString().trim() === "") {
      alert("Escribe el total de la venta");
      return;
    }

    setVentas([
      ...ventas,
      {
        id: Date.now(),
        total: Number(nuevaVenta.total),
        metodo: nuevaVenta.metodo,
        fecha: new Date().toLocaleString(),
      },
    ]);

    setNuevaVenta({
      total: "",
      metodo: "Efectivo",
    });
  };

  const guardarGasto = () => {
    if (
      nuevoGasto.concepto.trim() === "" ||
      nuevoGasto.monto.toString().trim() === ""
    ) {
      alert("Escribe el nombre del gasto y el monto");
      return;
    }

    setGastos([
      ...gastos,
      {
        id: Date.now(),
        concepto: nuevoGasto.concepto.trim(),
        monto: Number(nuevoGasto.monto),
        metodo: nuevoGasto.metodo,
        fecha: new Date().toLocaleString(),
      },
    ]);

    setNuevoGasto({
      concepto: "",
      monto: "",
      metodo: "Efectivo",
    });
  };

  const eliminarVenta = (id) => {
    if (!window.confirm("¿Seguro que deseas borrar esta venta?")) return;
    setVentas(ventas.filter((venta) => venta.id !== id));
  };

  const eliminarGasto = (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este gasto?")) return;
    setGastos(gastos.filter((gasto) => gasto.id !== id));
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.farmLeft}>🌾</div>
          <div>
            <h1 style={styles.title}>🐔 Granja La Lomita</h1>
            <p style={styles.subtitle}>Sistema simple de ventas y gastos</p>
          </div>
          <div style={styles.farmRight}>🌿</div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={{ ...styles.summaryCard, ...styles.summaryVenta }}>
            <div style={styles.summaryIcon}>🛒</div>
            <div>
              <div style={styles.summaryLabelVenta}>Venta bruta</div>
              <div style={styles.summaryValueVenta}>${ventaBruta}</div>
            </div>
          </div>

          <div style={{ ...styles.summaryCard, ...styles.summaryGasto }}>
            <div style={styles.summaryIcon}>👛</div>
            <div>
              <div style={styles.summaryLabelGasto}>Gastos</div>
              <div style={styles.summaryValueGasto}>${totalGastos}</div>
            </div>
          </div>

          <div style={{ ...styles.summaryCard, ...styles.summaryUtilidad }}>
            <div style={styles.summaryIcon}>📈</div>
            <div>
              <div style={styles.summaryLabelUtilidad}>Utilidad neta</div>
              <div style={styles.summaryValueUtilidad}>${utilidadNeta}</div>
            </div>
          </div>
        </div>

        <div style={styles.formGrid}>
          <div style={{ ...styles.card, ...styles.saleCard }}>
            <h2 style={{ ...styles.sectionTitle, color: "#0f52ba" }}>
              🛍️ Registrar venta
            </h2>

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

          <div style={{ ...styles.card, ...styles.expenseCard }}>
            <h2 style={{ ...styles.sectionTitle, color: "#be123c" }}>
              👛 Registrar gasto
            </h2>

            <input
              style={styles.input}
              list="conceptos-gastos"
              placeholder="Nombre del gasto"
              value={nuevoGasto.concepto}
              onChange={(e) =>
                setNuevoGasto({ ...nuevoGasto, concepto: e.target.value })
              }
            />

            <datalist id="conceptos-gastos">
              <option value="Alimento" />
              <option value="Gasolina" />
              <option value="Nono" />
              <option value="Mamá" />
              <option value="Papá" />
              <option value="Tío Mario" />
              <option value="Etiquetas" />
              <option value="Verduras" />
              <option value="Vitafort" />
              <option value="Doceneras" />
              <option value="Paca de trigo" />
              <option value="Pastillas para perros" />
              <option value="Propina" />
              <option value="Otro" />
            </datalist>

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
        </div>

        <div style={styles.card}>
          <button
            style={{ ...styles.folderButton, ...styles.folderBlue }}
            onClick={() => setMostrarVentas(!mostrarVentas)}
          >
            <span>🛒 📁 Ventas registradas</span>
            <span>{mostrarVentas ? "▲" : "▼"}</span>
          </button>

          {mostrarVentas && (
            <>
              <div style={styles.totalBox}>
                <strong>Venta bruta:</strong> ${ventaBruta}
              </div>

              {ventas.length === 0 ? (
                <p>No hay ventas todavía</p>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Total</th>
                        <th style={styles.th}>Método</th>
                        <th style={styles.th}>Fecha</th>
                        <th style={styles.th}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.map((venta) => (
                        <tr key={venta.id}>
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
            style={{ ...styles.folderButton, ...styles.folderRed }}
            onClick={() => setMostrarGastos(!mostrarGastos)}
          >
            <span>👛 📁 Gastos registrados</span>
            <span>{mostrarGastos ? "▲" : "▼"}</span>
          </button>

          {mostrarGastos && (
            <>
              <div style={styles.totalBoxRed}>
                <strong>Gastos:</strong> ${totalGastos}
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
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #fff7cc 0%, transparent 28%), radial-gradient(circle at bottom right, #d9f99d 0%, transparent 26%), linear-gradient(180deg, #fff8e7 0%, #f9ffe9 48%, #fff1e6 100%)",
    padding: "0",
  },
  container: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "30px 22px 50px",
    fontFamily: "Arial, sans-serif",
  },
  hero: {
    position: "relative",
    textAlign: "center",
    padding: "24px 10px 20px",
    borderRadius: "0 0 28px 28px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,247,215,0.35))",
    marginBottom: "12px",
  },
  farmLeft: {
    position: "absolute",
    left: "20px",
    top: "28px",
    fontSize: "34px",
    opacity: 0.7,
  },
  farmRight: {
    position: "absolute",
    right: "20px",
    top: "28px",
    fontSize: "34px",
    opacity: 0.7,
  },
  title: {
    textAlign: "center",
    margin: "0 0 8px",
    fontSize: "46px",
    color: "#4a2606",
    textShadow: "1px 2px 0 rgba(255,255,255,0.8)",
  },
  subtitle: {
    textAlign: "center",
    color: "#2f6b2f",
    margin: "0",
    fontSize: "20px",
    fontWeight: "700",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },
  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "24px",
    borderRadius: "22px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
    border: "1px solid rgba(255,255,255,0.8)",
  },
  summaryVenta: {
    background: "linear-gradient(135deg, #ecfdf5, #ffffff)",
    border: "1px solid #b7e4c7",
  },
  summaryGasto: {
    background: "linear-gradient(135deg, #fff1f2, #ffffff)",
    border: "1px solid #fecdd3",
  },
  summaryUtilidad: {
    background: "linear-gradient(135deg, #f5f3ff, #ffffff)",
    border: "1px solid #ddd6fe",
  },
  summaryIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  },
  summaryLabelVenta: {
    color: "#15803d",
    fontSize: "16px",
    marginBottom: "8px",
    fontWeight: "800",
  },
  summaryLabelGasto: {
    color: "#dc2626",
    fontSize: "16px",
    marginBottom: "8px",
    fontWeight: "800",
  },
  summaryLabelUtilidad: {
    color: "#4f46e5",
    fontSize: "16px",
    marginBottom: "8px",
    fontWeight: "800",
  },
  summaryValueVenta: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#15803d",
  },
  summaryValueGasto: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#dc2626",
  },
  summaryValueUtilidad: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#4f46e5",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    padding: "22px",
    marginBottom: "18px",
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(120, 80, 20, 0.10)",
    border: "1px solid rgba(255, 210, 130, 0.42)",
    backdropFilter: "blur(6px)",
  },
  saleCard: {
    background:
      "linear-gradient(135deg, rgba(239,246,255,0.92), rgba(255,255,255,0.92))",
    border: "1px solid #bfdbfe",
  },
  expenseCard: {
    background:
      "linear-gradient(135deg, rgba(255,241,242,0.92), rgba(255,255,255,0.92))",
    border: "1px solid #fecdd3",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
    color: "#3b240c",
    fontSize: "24px",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "13px",
    padding: "13px",
    borderRadius: "11px",
    border: "1px solid #d6d3d1",
    boxSizing: "border-box",
    fontSize: "15px",
    backgroundColor: "#fffefa",
  },
  blueButton: {
    width: "100%",
    background: "linear-gradient(135deg, #2563eb, #0f52ba)",
    color: "white",
    border: "none",
    padding: "14px 18px",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(37,99,235,0.25)",
    fontSize: "15px",
  },
  redButton: {
    width: "100%",
    background: "linear-gradient(135deg, #f43f5e, #be123c)",
    color: "white",
    border: "none",
    padding: "14px 18px",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(244,63,94,0.25)",
    fontSize: "15px",
  },
  deleteButton: {
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  folderButton: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "12px",
  },
  folderBlue: {
    background: "linear-gradient(135deg, #eff6ff, #ffffff)",
    border: "1px solid #bfdbfe",
    color: "#0f52ba",
  },
  folderRed: {
    background: "linear-gradient(135deg, #fff1f2, #ffffff)",
    border: "1px solid #fecdd3",
    color: "#be123c",
  },
  totalBox: {
    backgroundColor: "#e8f5e9",
    color: "#1b5e20",
    padding: "12px 14px",
    borderRadius: "10px",
    marginBottom: "14px",
    fontSize: "18px",
  },
  totalBoxRed: {
    backgroundColor: "#ffebee",
    color: "#b71c1c",
    padding: "12px 14px",
    borderRadius: "10px",
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
    borderRadius: "12px",
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#fef3c7",
    borderBottom: "2px solid #facc15",
    fontSize: "14px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    verticalAlign: "top",
  },
};
