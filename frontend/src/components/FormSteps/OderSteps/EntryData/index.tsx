import "./styles.css";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import { SupplierDTO } from "../../../../models/supplierDto";
import { requestBackend } from "../../../../utils/requests";

type Props = {
  data: any;
  updateFildHandle: (key: string, value: any) => void;
  errors: any;

  // vindos do pai (mantidos para compatibilidade, mas não usados aqui)
  isEditing: boolean;
  orderId?: number | null;
};

export default function EntryData(props: Props) {
  // Desestruture APENAS o que usamos, para evitar TS6133 em isEditing/orderId
  const { data, updateFildHandle, errors } = props;

  const [selectSupplier, setSelectSupplier] = useState<SupplierDTO[]>([]);

  // Carrega fornecedores — sem definir default (deixa em branco por padrão)
  useEffect(() => {
    let ignore = false;

    requestBackend({
      url: "/suppliers",
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        if (ignore) return;
        const suppliers: SupplierDTO[] = response.data?.content ?? [];
        setSelectSupplier(suppliers);
      })
      .catch((e) => {
        console.error("Falha ao carregar fornecedores:", e);
      });

    return () => {
      ignore = true;
    };
  }, []); // roda apenas uma vez

  return (
    <div className="proj-order-step-entry-container">
      <h2 className="proj-mb20">Dados de Entrada</h2>

      <div className="proj-order-step-entry-controls-container">
        <div>
          <h5>Data de Entrada</h5>
          <input
            type="date"
            value={data.entryDate || ""}
            autoFocus
            onChange={(e) => updateFildHandle("entryDate", e.target.value)}
            className={`proj-order-step-entry-control ${
              errors.entryDate ? "error" : ""
            }`}
          />
          {errors.entryDate && (
            <p className="error-text">{errors.entryDate}</p>
          )}
        </div>

        <div>
          <h5>Fornecedor</h5>
          <ReactSelect
            options={selectSupplier}
            classNamePrefix="proj-order-step-entry-control"
            value={data.supplier || null} // fica sem fornecedor por padrão
            placeholder="Escolha uma opção"
            isClearable
            getOptionLabel={(opt: SupplierDTO) => opt.name}
            getOptionValue={(opt: SupplierDTO) => String(opt.id)}
            onChange={(selected) => updateFildHandle("supplier", selected)}
          />
          {errors.supplier && (
            <p className="error-text">{errors.supplier}</p>
          )}
        </div>
      </div>
    </div>
  );
}
