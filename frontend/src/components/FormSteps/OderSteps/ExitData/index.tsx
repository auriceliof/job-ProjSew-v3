import "./styles.css";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import { requestBackend } from "../../../../utils/requests";
import { StatusDTO } from "../../../../models/statusDto";
import { FaBoxOpen } from "react-icons/fa";
import * as exitService from "../../../../services/orderexit-service";
import { OrderExitDTO } from "../../../../models/orderExitDto";

type Props = {
  data: any;
  updateFildHandle: (k: string, v: any) => void;
  errors: any;
  isEditing: boolean;
  orderId?: number | null;
};

export default function ExitData({
  data,
  updateFildHandle,
  errors,
  isEditing,
  orderId,
}: Props) {
  const [selectStatus, setSelectStatus] = useState<StatusDTO[]>([]);
  const [totalSaidas, setTotalSaidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // 🔹 Carrega lista de status
  useEffect(() => {
    requestBackend({ url: "/status", method: "GET", withCredentials: true })
      .then((r) => setSelectStatus(r.data?.content ?? []))
      .catch(() => {});
  }, []);

  // 🔹 Carrega saídas do backend
  useEffect(() => {
    if (!isEditing || !orderId) return;
    exitLoad();
  }, [isEditing, orderId]);

  function exitLoad() {
    setLoading(true);
    exitService
      .findPageRequest(0, "", 50, "exitDate,asc", orderId ?? undefined)
      .then((res) => {
        const saidas: OrderExitDTO[] = res.data?.content ?? [];
        const total = saidas.reduce((acc, s) => acc + (s.quantityProd ?? 0), 0);
        setTotalSaidas(total);
        updateFildHandle("totalExited", total);
      })
      .catch(() => {
        setTotalSaidas(0);
        updateFildHandle("totalExited", 0);
      })
      .finally(() => setLoading(false));
  }

  // 🔹 Quantidade - valida limite
  const totalPedido = data.quantityProd ?? 0;
  const qtdSaidaAtual = Number(data.quantityExit ?? 0);
  const totalSaidasComAtual = totalSaidas + qtdSaidaAtual;
  const faltaSair = Math.max(totalPedido - totalSaidasComAtual, 0);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value ?? 0);
    updateFildHandle("quantityExit", value);

    const totalDisponivel = Math.max(totalPedido - totalSaidas, 0);
    if (value > totalDisponivel) {
      const msg = `A quantidade informada (${value}) excede o total disponível (${totalDisponivel}).`;
      setLocalError(msg);
      updateFildHandle("exitError", msg);
    } else {
      setLocalError(null);
      updateFildHandle("exitError", null);
    }
  };

  // 🔹 Data de saída - valida se é futura
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFildHandle("exitDate", value);

    if (value) {
      const today = new Date();
      const selected = new Date(value + "T00:00:00");

      if (selected > today) {
        const msg = "A data de saída não pode ser futura.";
        setDateError(msg);
        updateFildHandle("exitError", msg); // 🔸 envia erro global
        return;
      }
    }

    setDateError(null);
    updateFildHandle("exitError", null);
  };

  return (
    <div className="proj-order-step-entry-container">
      <h2 className="proj-mb20">Dados de Saída</h2>

      <div className="proj-order-step-entry-controls-container">
        <div>
          <h5>Status</h5>
          <ReactSelect
            options={selectStatus}
            classNamePrefix="proj-order-step-entry-control"
            value={data.status || null}
            placeholder="Escolha uma opção"
            isClearable
            getOptionLabel={(opt: StatusDTO) => opt.name}
            getOptionValue={(opt: StatusDTO) => String(opt.id)}
            onChange={(selected) => updateFildHandle("status", selected)}
          />
          {errors.status && <p className="error-text">{errors.status}</p>}
        </div>

        <div>
          <h5>Data de Saída</h5>
          <input
            type="date"
            value={data.exitDate || ""}
            onChange={handleDateChange}
            className={`proj-order-step-entry-control ${
              dateError ? "error" : ""
            }`}
          />
          {dateError && <p className="error-text">{dateError}</p>}
        </div>

        <div>
          <h5>Quantidade Saída</h5>
          <input
            type="number"
            min={0}
            value={data.quantityExit || ""}
            onChange={handleQuantityChange}
            className={`proj-order-step-entry-control ${
              localError ? "error" : ""
            }`}
          />
          {localError && <p className="error-text">{localError}</p>}
        </div>
      </div>

      <div className="proj-exit-summary-card">
        <div className="proj-exit-summary-header">
          <FaBoxOpen className="proj-exit-summary-icon" />
          <h4>Resumo da Saída</h4>
        </div>

        <div className="proj-exit-summary-body">
          <div>
            <span>Total Pedido</span>
            <strong>{totalPedido}</strong>
          </div>
          <div>
            <span>Total Saído</span>
            <strong className="text-green">
              {loading ? "..." : totalSaidasComAtual}
            </strong>
          </div>
          <div>
            <span>Falta Sair</span>
            <strong className="text-red">{loading ? "..." : faltaSair}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
