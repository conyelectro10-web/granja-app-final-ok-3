import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [ventas, setVentas] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [cortes, setCortes] = useState([]);

  const [nuevaVenta, setNuevaVenta] = useState({
    total: "",
  });

  const [nuevoGasto, setNuevoGasto] = useState({
    concepto: "",
    monto: "",
  });

  const [mostrarVentas, setMostrarVentas] = useState(false);
  const [mostrarGastos, setMostrarGastos] = useState(false);
  const [mostrarCortes, setMostrarCortes] = useState(false);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);

    try {
      const [
        { data: ventasData, error: ventasError },
        { data: gastosData, error: gastosError },
        { data: cortesData, error: cortesError },
      ] = await Promise.all([
        supabase
          .from("ventas")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("gastos")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("cortes")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (ventasError) throw ventasError;
      if (gastosError) throw gastosError;
      if (cortesError) throw cortesError;

      setVentas(ventasData || []);
      setGastos(gastosData || []);
      setCortes(cortesData || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert(
        "No se pudieron cargar los datos. Revisa tu conexión a internet e inténtalo nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  const guardarVenta = async () => {
    const total = Number(nuevaVenta.total);

    if (
      nuevaVenta.total.toString().trim() === "" ||
      Number.isNaN(total) ||
      total <= 0
    ) {
      alert("Escribe un monto válido para la venta");
      return;
    }

    setGuardando(true);

    try {
      const { data, error } = await supabase
        .from("ventas")
        .insert([
          {
            total,
            metodo: "Efectivo",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setVentas((actuales) => [data, ...actuales]);

      setNuevaVenta({
        total: "",
      });
    } catch (error) {
      console.error("Error guardando venta:", error);
      alert("No se pudo guardar la venta. Inténtalo nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  const guardarGasto = async () => {
    const monto = Number(nuevoGasto.monto);
    const concepto = nuevoGasto.concepto.trim();

    if (
      concepto === "" ||
      nuevoGasto.monto.toString().trim() === "" ||
      Number.isNaN(monto) ||
      monto <= 0
    ) {
      alert("Escribe el concepto y un monto válido");
      return;
    }

    setGuardando(true);

    try {
      const { data, error } = await supabase
        .from("gastos")
        .insert([
          {
            concepto,
            monto,
            metodo: "Efectivo",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setGastos((actuales) => [data, ...actuales]);

      setNuevoGasto({
        concepto: "",
        monto: "",
      });
    } catch (error) {
      console.error("Error guardando gasto:", error);
      alert("No se pudo guardar el gasto. Inténtalo nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarVenta = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas borrar esta venta?"
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("ventas")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setVentas((actuales) =>
        actuales.filter((venta) => venta.id !== id)
      );
    } catch (error) {
      console.error("Error borrando venta:", error);
      alert("No se pudo borrar la venta.");
    }
  };

  const eliminarGasto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas borrar este gasto?"
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("gastos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setGastos((actuales) =>
        actuales.filter((gasto) => gasto.id !== id)
      );
    } catch (error) {
      console.error("Error borrando gasto:", error);
      alert("No se pudo borrar el gasto.");
    }
  };

  const eliminarCorte = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas borrar este corte histórico?"
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("cortes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCortes((actuales) =>
        actuales.filter((corte) => corte.id !== id)
      );
    } catch (error) {
      console.error("Error borrando corte:", error);
      alert("No se pudo borrar el corte.");
    }
  };

  const ventaBruta = useMemo(() => {
    return ventas.reduce(
      (acum, venta) => acum + Number(venta.total || 0),
      0
    );
  }, [ventas]);

  const totalGastos = useMemo(() => {
    return gastos.reduce(
      (acum, gasto) => acum + Number(gasto.monto || 0),
      0
    );
  }, [gastos]);

  const utilidadNeta = useMemo(() => {
    return ventaBruta - totalGastos;
  }, [ventaBruta, totalGastos]);

  const cerrarCorteSemanal = async () => {
    if (ventas.length === 0 && gastos.length === 0) {
      alert("No hay ventas ni gastos para cerrar el corte");
      return;
    }

    const confirmar = window.confirm(
      "¿Cerrar el corte semanal? El corte quedará guardado y la nueva semana comenzará en cero."
    );

    if (!confirmar) return;

    setGuardando(true);

    try {
      const { error } = await supabase.rpc(
        "cerrar_corte_semanal"
      );

      if (error) throw error;

      await cargarDatos();

      alert(
        "Corte semanal guardado correctamente. La nueva semana comenzó en cero."
      );
    } catch (error) {
      console.error("Error cerrando corte:", error);
      alert(
        "No se pudo cerrar el corte. Los datos actuales no fueron eliminados."
      );
    } finally {
      setGuardando(false);
    }
  };

  const dinero = (cantidad) => {
    return Number(cantidad || 0).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });
  };

  const fecha = (valor) => {
    if (!valor) return "";

    return new Date(valor).toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  if (cargando) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>
          <div style={{ fontSize: "50px", marginBottom: "15px" }}>
            🐔
          </div>
          <h2 style={{ margin: 0, color: "#4a2606" }}>
            Granja La Lomita
          </h2>
          <p style={{ color: "#666" }}>Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.farmLeft}>🌾</div>

          <div>
            <h1 style={styles.title}>🐔 Granja La Lomita</h1>

            <p style={styles.subtitle}>
              Control semanal de ventas y gastos
            </p>
          </div>

          <div style={styles.farmRight}>🌿</div>
        </div>

        <div style={styles.summaryGrid}>
          <div
            style={{
              ...styles.summaryCard,
              ...styles.summaryVenta,
            }}
          >
            <div style={styles.summaryIcon}>🛒</div>

            <div>
              <div style={styles.summaryLabelVenta}>
                Venta bruta
              </div>

              <div style={styles.summaryValueVenta}>
                {dinero(ventaBruta)}
              </div>
            </div>
          </div>

          <div
            style={{
              ...styles.summaryCard,
              ...styles.summaryGasto,
            }}
          >
            <div style={styles.summaryIcon}>👛</div>

            <div>
              <div style={styles.summaryLabelGasto}>
                Gastos
              </div>

              <div style={styles.summaryValueGasto}>
                {dinero(totalGastos)}
              </div>
            </div>
          </div>

          <div
            style={{
              ...styles.summaryCard,
              ...styles.summaryUtilidad,
            }}
          >
            <div style={styles.summaryIcon}>📈</div>

            <div>
              <div style={styles.summaryLabelUtilidad}>
                Utilidad
              </div>

              <div style={styles.summaryValueUtilidad}>
                {dinero(utilidadNeta)}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.formGrid}>
          <div
            style={{
              ...styles.card,
              ...styles.saleCard,
            }}
          >
            <h2
              style={{
                ...styles.sectionTitle,
                color: "#0f52ba",
              }}
            >
              🛒 Registrar venta
            </h2>

            <input
              style={styles.bigInput}
              type="number"
              min="0"
              step="0.01"
              placeholder="Monto de la venta"
              value={nuevaVenta.total}
              onChange={(e) =>
                setNuevaVenta({
                  total: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") guardarVenta();
              }}
            />

            <button
              style={styles.blueButton}
              onClick={guardarVenta}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar venta"}
            </button>
          </div>

          <div
            style={{
              ...styles.card,
              ...styles.expenseCard,
            }}
          >
            <h2
              style={{
                ...styles.sectionTitle,
                color: "#be123c",
              }}
            >
              👛 Registrar gasto
            </h2>

            <input
              style={styles.input}
              list="conceptos-gasto"
              placeholder="Nombre del gasto"
              value={nuevoGasto.concepto}
              onChange={(e) =>
                setNuevoGasto({
                  ...nuevoGasto,
                  concepto: e.target.value,
                })
              }
            />

            <datalist id="conceptos-gasto">
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
            </datalist>

            <input
              style={styles.bigInput}
              type="number"
              min="0"
              step="0.01"
              placeholder="Monto del gasto"
              value={nuevoGasto.monto}
              onChange={(e) =>
                setNuevoGasto({
                  ...nuevoGasto,
                  monto: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") guardarGasto();
              }}
            />

            <button
              style={styles.redButton}
              onClick={guardarGasto}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar gasto"}
            </button>
          </div>
        </div>

        <div style={styles.cutCard}>
          <h2
            style={{
              ...styles.sectionTitle,
              marginBottom: 0,
            }}
          >
            📅 Cerrar corte semanal
          </h2>

          <button
            style={styles.orangeButton}
            onClick={cerrarCorteSemanal}
            disabled={guardando}
          >
            {guardando
              ? "Procesando..."
              : "Cerrar corte semanal"}
          </button>
        </div>

        <div style={styles.card}>
          <button
            style={{
              ...styles.folderButton,
              ...styles.folderBlue,
            }}
            onClick={() =>
              setMostrarVentas(!mostrarVentas)
            }
          >
            <span>
              🛒 📁 Ventas semana actual ({ventas.length})
            </span>

            <span>{mostrarVentas ? "▲" : "▼"}</span>
          </button>

          {mostrarVentas && (
            <>
              <div style={styles.totalBox}>
                <strong>Venta bruta:</strong>{" "}
                {dinero(ventaBruta)}
              </div>

              {ventas.length === 0 ? (
                <p>No hay ventas todavía.</p>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Monto</th>
                        <th style={styles.th}>Fecha</th>
                        <th style={styles.th}>Acción</th>
                      </tr>
                    </thead>

                    <tbody>
                      {ventas.map((venta) => (
                        <tr key={venta.id}>
                          <td style={styles.td}>
                            <strong>
                              {dinero(venta.total)}
                            </strong>
                          </td>

                          <td style={styles.td}>
                            {fecha(venta.created_at)}
                          </td>

                          <td style={styles.td}>
                            <button
                              style={styles.deleteButton}
                              onClick={() =>
                                eliminarVenta(venta.id)
                              }
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
            style={{
              ...styles.folderButton,
              ...styles.folderRed,
            }}
            onClick={() =>
              setMostrarGastos(!mostrarGastos)
            }
          >
            <span>
              👛 📁 Gastos semana actual ({gastos.length})
            </span>

            <span>{mostrarGastos ? "▲" : "▼"}</span>
          </button>

          {mostrarGastos && (
            <>
              <div style={styles.totalBoxRed}>
                <strong>Total de gastos:</strong>{" "}
                {dinero(totalGastos)}
              </div>

              {gastos.length === 0 ? (
                <p>No hay gastos todavía.</p>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Concepto</th>
                        <th style={styles.th}>Monto</th>
                        <th style={styles.th}>Fecha</th>
                        <th style={styles.th}>Acción</th>
                      </tr>
                    </thead>

                    <tbody>
                      {gastos.map((gasto) => (
                        <tr key={gasto.id}>
                          <td style={styles.td}>
                            {gasto.concepto}
                          </td>

                          <td style={styles.td}>
                            <strong>
                              {dinero(gasto.monto)}
                            </strong>
                          </td>

                          <td style={styles.td}>
                            {fecha(gasto.created_at)}
                          </td>

                          <td style={styles.td}>
                            <button
                              style={styles.deleteButton}
                              onClick={() =>
                                eliminarGasto(gasto.id)
                              }
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
            style={{
              ...styles.folderButton,
              ...styles.folderPurple,
            }}
            onClick={() =>
              setMostrarCortes(!mostrarCortes)
            }
          >
            <span>
              📋 📁 Historial de cortes ({cortes.length})
            </span>

            <span>{mostrarCortes ? "▲" : "▼"}</span>
          </button>

          {mostrarCortes && (
            <>
              {cortes.length === 0 ? (
                <p>No hay cortes cerrados todavía.</p>
              ) : (
                cortes.map((corte) => (
                  <div
                    key={corte.id}
                    style={styles.cutBox}
                  >
                    <h3
                      style={{
                        marginTop: 0,
                        color: "#4a2606",
                      }}
                    >
                      📅 Corte semanal
                    </h3>

                    <p>
                      <strong>Fecha:</strong>{" "}
                      {fecha(corte.created_at)}
                    </p>

                    <p>
                      <strong>Venta bruta:</strong>{" "}
                      {dinero(corte.venta_bruta)}
                    </p>

                    <p>
                      <strong>Gastos:</strong>{" "}
                      {dinero(corte.total_gastos)}
                    </p>

                    <p>
                      <strong>Utilidad:</strong>{" "}
                      {dinero(corte.utilidad_neta)}
                    </p>

                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        eliminarCorte(corte.id)
                      }
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

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(180deg, #fff8e7 0%, #f9ffe9 100%)",
    fontFamily: "Arial, sans-serif",
  },

  loadingBox: {
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: "35px",
    borderRadius: "22px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
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
    textShadow:
      "1px 2px 0 rgba(255,255,255,0.8)",
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
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
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
  },

  summaryVenta: {
    background:
      "linear-gradient(135deg, #ecfdf5, #ffffff)",
    border: "1px solid #b7e4c7",
  },

  summaryGasto: {
    background:
      "linear-gradient(135deg, #fff1f2, #ffffff)",
    border: "1px solid #fecdd3",
  },

  summaryUtilidad: {
    background:
      "linear-gradient(135deg, #f5f3ff, #ffffff)",
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
    flexShrink: 0,
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
    fontSize: "32px",
    fontWeight: "bold",
    color: "#15803d",
  },

  summaryValueGasto: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#dc2626",
  },

  summaryValueUtilidad: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#4f46e5",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
    marginBottom: "5px",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.90)",
    padding: "22px",
    marginBottom: "18px",
    borderRadius: "20px",
    boxShadow:
      "0 8px 24px rgba(120, 80, 20, 0.10)",
    border:
      "1px solid rgba(255, 210, 130, 0.42)",
  },

  saleCard: {
    background:
      "linear-gradient(135deg, rgba(239,246,255,0.95), rgba(255,255,255,0.95))",
    border: "1px solid #bfdbfe",
  },

  expenseCard: {
    background:
      "linear-gradient(135deg, rgba(255,241,242,0.95), rgba(255,255,255,0.95))",
    border: "1px solid #fecdd3",
  },

  cutCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    backgroundColor: "rgba(255,255,255,0.90)",
    padding: "24px",
    marginBottom: "24px",
    borderRadius: "22px",
    boxShadow:
      "0 8px 24px rgba(120, 80, 20, 0.10)",
    border:
      "1px solid rgba(245, 158, 11, 0.35)",
    flexWrap: "wrap",
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
    padding: "15px",
    borderRadius: "11px",
    border: "1px solid #d6d3d1",
    boxSizing: "border-box",
    fontSize: "16px",
    backgroundColor: "#fffefa",
  },

  bigInput: {
    display: "block",
    width: "100%",
    marginBottom: "13px",
    padding: "16px",
    borderRadius: "11px",
    border: "1px solid #d6d3d1",
    boxSizing: "border-box",
    fontSize: "20px",
    fontWeight: "bold",
    backgroundColor: "#fffefa",
  },

  blueButton: {
    width: "100%",
    background:
      "linear-gradient(135deg, #2563eb, #0f52ba)",
    color: "white",
    border: "none",
    padding: "15px 18px",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow:
      "0 4px 10px rgba(37,99,235,0.25)",
    fontSize: "16px",
  },

  redButton: {
    width: "100%",
    background:
      "linear-gradient(135deg, #f43f5e, #be123c)",
    color: "white",
    border: "none",
    padding: "15px 18px",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow:
      "0 4px 10px rgba(244,63,94,0.25)",
    fontSize: "16px",
  },

  orangeButton: {
    background:
      "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow:
      "0 4px 10px rgba(245,158,11,0.30)",
    whiteSpace: "nowrap",
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
    background:
      "linear-gradient(135deg, #eff6ff, #ffffff)",
    border: "1px solid #bfdbfe",
    color: "#0f52ba",
  },

  folderRed: {
    background:
      "linear-gradient(135deg, #fff1f2, #ffffff)",
    border: "1px solid #fecdd3",
    color: "#be123c",
  },

  folderPurple: {
    background:
      "linear-gradient(135deg, #f5f3ff, #ffffff)",
    border: "1px solid #ddd6fe",
    color: "#4f46e5",
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
    verticalAlign: "middle",
  },

  cutBox: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "14px",
    backgroundColor: "#fffefa",
  },
};
