import { useEffect, useMemo, useState } from "react";
import * as OrderService from "../../services/order-service";
import { OrderDTO } from "../../models/orderDto";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./styles.css";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const MONTH_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const STATUS_COLORS: Record<string, string> = {
  Aguardando: "#ef4444",
  Produção: "#eab308",
  Finalizado: "#22c55e",
  Quitado: "#6b7280",
};

function parseISODate(d?: string) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}
function ymKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}
function ymLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return `${MONTH_SHORT[(m - 1) % 12]}/${String(y).slice(-2)}`;
}

export default function StatsDashboard() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageWindow, setPageWindow] = useState(5); // configurável pelo usuário

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        let all: OrderDTO[] = [];
        let totalPages = 1;
        for (let p = 0; p < pageWindow; p++) {
          const r = await OrderService.findPageRequest(p, "", null, null);
          if (cancelled) return;
          const page = r.data;
          totalPages = page.totalPages ?? 1;
          all = all.concat(page.content || []);
          if (p + 1 >= totalPages) break;
        }
        setOrders(all);
      } catch (e: any) {
        console.error(e);
        setError("Falha ao carregar dados de Ordens.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageWindow]);

  const statusData = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      const n = o.status?.name || "—";
      map.set(n, (map.get(n) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const monthlyData = useMemo(() => {
    const map = new Map<string, { total: number; pago: number }>();
    for (const o of orders) {
      const dt = parseISODate(String(o.entryDate));
      if (!dt) continue;
      const key = ymKey(dt);
      const agg = map.get(key) || { total: 0, pago: 0 };
      agg.total += Number(o.totalAmount || 0);
      agg.pago += Number(o.paidValue || 0);
      map.set(key, agg);
    }
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .slice(-6)
      .map(([key, v]) => ({ mes: ymLabel(key), Total: v.total, Pago: v.pago }));
  }, [orders]);

  const topProductsData = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      const name = o.product?.name || "—";
      map.set(name, (map.get(name) || 0) + Number(o.totalAmount || 0));
    }
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const da = parseISODate(String(a.entryDate))?.getTime() || 0;
        const db = parseISODate(String(b.entryDate))?.getTime() || 0;
        return db - da;
      })
      .slice(0, 8);
  }, [orders]);

  return (
    <section className="proj-sew-stats-container">
      <header className="proj-sew-stats-header">
        <div>
          <div>
            <h2>Estatísticas</h2>
          </div>
          <div className="proj-sew-stats-controls">
            <label>
              Páginas a carregar:
              <select
                value={pageWindow}
                onChange={(e) => setPageWindow(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      <div className="proj-sew-dash-grid">
        <div className="proj-sew-dash-card">
          <div className="proj-sew-dash-card-header">
            <h3>Distribuição por Status</h3>
            <span className="proj-sew-muted">amostra</span>
          </div>
          {loading ? (
            <div className="proj-sew-dash-skeleton" />
          ) : error ? (
            <div className="proj-sew-dash-error">{error}</div>
          ) : (
            <div className="proj-sew-dash-chart">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                  >
                    {statusData.map((e, i) => (
                      <Cell key={i} fill={STATUS_COLORS[e.name] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => String(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="proj-sew-dash-card">
          <div className="proj-sew-dash-card-header">
            <h3>Faturamento Mensal</h3>
            <span className="proj-sew-muted">Total x Pago</span>
          </div>
          {loading ? (
            <div className="proj-sew-dash-skeleton" />
          ) : error ? (
            <div className="proj-sew-dash-error">{error}</div>
          ) : (
            <div className="proj-sew-dash-chart">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis
                    tickFormatter={(v) =>
                      BRL.format(Number(v)).replace(/^R\$\s?/, "")
                    }
                  />
                  <Tooltip formatter={(v: any) => BRL.format(Number(v))} />
                  <Legend />
                  <Bar dataKey="Total" />
                  <Bar dataKey="Pago" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="proj-sew-dash-card">
          <div className="proj-sew-dash-card-header">
            <h3>Top Produtos por Receita</h3>
            <span className="proj-sew-muted">top 7</span>
          </div>
          {loading ? (
            <div className="proj-sew-dash-skeleton" />
          ) : error ? (
            <div className="proj-sew-dash-error">{error}</div>
          ) : (
            <div className="proj-sew-dash-chart">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={topProductsData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) =>
                      BRL.format(Number(v)).replace(/^R\$\s?/, "")
                    }
                  />
                  <YAxis type="category" dataKey="name" width={140} />
                  <Tooltip formatter={(v: any) => BRL.format(Number(v))} />
                  <Bar dataKey="total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="proj-sew-dash-card">
          <div className="proj-sew-dash-card-header">
            <h3>Entradas Recentes</h3>
            <span className="proj-sew-muted">8 últimas</span>
          </div>
          {loading ? (
            <div className="proj-sew-dash-skeleton" />
          ) : error ? (
            <div className="proj-sew-dash-error">{error}</div>
          ) : (
            <div className="proj-sew-dash-table-wrapper">
              <table className="proj-sew-dash-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Produto</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => {
                    const dt = parseISODate(String(o.entryDate));
                    const date = dt ? dt.toLocaleDateString("pt-BR") : "—";
                    return (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{date}</td>
                        <td title={o.product?.name}>{o.product?.name}</td>
                        <td>
                          <span
                            className="proj-sew-badge"
                            style={{
                              background:
                                STATUS_COLORS[o.status?.name || ""] ||
                                "#9ca3af",
                              color: "#fff",
                            }}
                          >
                            {o.status?.name}
                          </span>
                        </td>
                        <td className="proj-sew-num">
                          {BRL.format(Number(o.totalAmount || 0))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
