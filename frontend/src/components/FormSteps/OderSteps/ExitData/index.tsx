import "./styles.css";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import { requestBackend } from "../../../../utils/requests";
import * as orderService from "../../../../services/order-service";
import { StatusDTO } from "../../../../models/statusDto";

type Props = {
  data: any;
  updateFildHandle: (k: string, v: any) => void;
  errors: any;

  // 🔧 novos props vindos do pai
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

  // Carrega lista de status
  useEffect(() => {
    let ignore = false;

    requestBackend({
      url: "/status",
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        if (ignore) return;
        setSelectStatus(response.data?.content ?? []);
      })
      .catch((e) => {
        console.error("Falha ao carregar status:", e);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Hidrata dados de saída somente em edição
  useEffect(() => {
    if (!isEditing) return;
    if (!orderId || !Number.isFinite(orderId)) return;

    let ignore = false;

    orderService
      .findById(orderId)
      .then((response) => {
        if (ignore) return;
        updateFildHandle("exitDate", response.data.exitDate);
        updateFildHandle("status", response.data.status);
      })
      .catch((e) => {
        console.error("Falha ao carregar dados (ExitData):", e);
      });

    return () => {
      ignore = true;
    };
  }, [isEditing, orderId]);

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
            autoFocus
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
            onChange={(e) => updateFildHandle("exitDate", e.target.value)}
            className={`proj-order-step-entry-control ${
              errors.exitDate ? "error" : ""
            }`}
          />
          {errors.exitDate && <p className="error-text">{errors.exitDate}</p>}
        </div>
      </div>
    </div>
  );
}
