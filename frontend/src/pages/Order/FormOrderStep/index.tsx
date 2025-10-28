import "./styles.css";
import EntryData from "../../../components/FormSteps/OderSteps/EntryData";
import ProductData from "../../../components/FormSteps/OderSteps/ProductData";
import ConfirmationData from "../../../components/FormSteps/OderSteps/ConfirmationData";
import ExitData from "../../../components/FormSteps/OderSteps/ExitData";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { FiSend } from "react-icons/fi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderDTO } from "../../../models/orderDto";
import { OrderExitDTO } from "../../../models/orderExitDto";
import { Steps } from "../../../components/FormSteps/OderSteps/Steps";
import { AiOutlineProduct, AiOutlineUser } from "react-icons/ai";
import { FaIndent } from "react-icons/fa6";
import * as orderService from "../../../services/order-service";
import * as exitService from "../../../services/orderexit-service";

type RouteParams = {
  orderId?: string;
};

// ✅ Helper: garante "YYYY-MM-DD" sem problemas de fuso/UTC
function toYMD(input: string | Date | null | undefined): string {
  if (!input) return "";
  if (typeof input === "string") return input.slice(0, 10);
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ✅ Helper: normaliza números (evita enviar "" para campos numéricos)
function normalizeNumber(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

// ✅ Modelo de formulário adaptado ao UI
type FormData = Partial<Omit<OrderDTO, "entryDate" | "exitDate">> & {
  entryDate?: string;
  exitDate?: string;
  quantityExit?: number;
  totalExited?: number;
  exitError?: string | null;
};

export default function FormOrderStep() {
  const navigate = useNavigate();
  const { orderId } = useParams<RouteParams>();

  const isCreate = !orderId || orderId === "create";
  const isEditing = !isCreate;

  const [id, setId] = useState<number | null>(null);
  const [data, setData] = useState<FormData>({
    status: { id: 1 } as any,
    subProduct: null as any,
  });
  const [errors, setErrors] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);

  // Atualiza estado geral
  const updateFildHandleStrict = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateFildHandle: (key: string, value: any) => void = useCallback(
    (key, value) => {
      updateFildHandleStrict(key as keyof FormData, value as any);
    },
    [updateFildHandleStrict]
  );

  // Passos
  const steps = useMemo(
    () => [
      {
        key: "entry" as const,
        icon: <AiOutlineUser />,
        title: "Dados de Entrada",
        component: (
          <EntryData
            data={data}
            updateFildHandle={updateFildHandle}
            errors={errors}
            isEditing={isEditing}
            orderId={id}
          />
        ),
        enable: true,
      },
      {
        key: "product" as const,
        icon: <AiOutlineProduct />,
        title: "Produto",
        component: (
          <ProductData
            data={data}
            updateFildHandle={updateFildHandle}
            errors={errors}
            isEditing={isEditing}
            orderId={id}
          />
        ),
        enable: true,
      },
      {
        key: "exit" as const,
        icon: <FaIndent />,
        title: "Dados de Saída",
        component: (
          <ExitData
            data={data}
            updateFildHandle={updateFildHandle}
            errors={errors}
            isEditing={isEditing}
            orderId={id}
          />
        ),
        enable: isEditing,
      },
      {
        key: "confirm" as const,
        icon: <FiSend />,
        title: "Confirmação",
        component: <ConfirmationData data={data} />,
        enable: true,
      },
    ],
    [data, errors, isEditing, id, updateFildHandle]
  );

  const stepsFiltered = useMemo(
    () => steps.filter((s) => s.enable !== false),
    [steps]
  );

  // Carrega dados da ordem ao editar
  useEffect(() => {
    if (!isEditing || !orderId) return;

    const idNum = Number(orderId);
    if (!Number.isFinite(idNum)) return;

    orderService
      .findById(idNum)
      .then((response) => {
        const root = response.data ?? {};
        const fetchedData: any = root.orderDto ?? root;
        const resolvedId: number = root.id ?? fetchedData?.id ?? idNum;
        setId(resolvedId);

        setData({
          supplier: fetchedData?.supplier ?? null,
          product: fetchedData?.product ?? null,
          subProduct: fetchedData?.subProduct ?? null,
          entryDate: toYMD(fetchedData?.entryDate),
          exitDate: toYMD(fetchedData?.exitDate),
          unitAmountProd: normalizeNumber(fetchedData?.unitAmountProd),
          quantityProd: normalizeNumber(fetchedData?.quantityProd),
          unitAmountSubProd: normalizeNumber(fetchedData?.unitAmountSubProd),
          quantitySubProd: normalizeNumber(fetchedData?.quantitySubProd),
          status: fetchedData?.status ?? ({ id: 1 } as any),
        });
      })
      .catch((e) => console.error("Falha ao carregar a ordem:", e));
  }, [isEditing, orderId]);

  // ✅ Validação por step
  const validateStep = () => {
    const active = stepsFiltered[currentStep];
    let newErrors: any = {};

    if (!active) return true;

    switch (active.key) {
      case "entry":
        if (!data.entryDate) newErrors.entryDate = "Data de entrada é obrigatória";
        if (!data.supplier) newErrors.supplier = "Fornecedor é obrigatório";
        break;

      case "product":
        if (!data.product) newErrors.product = "Produto é obrigatório";
        if (!data.unitAmountProd || data.unitAmountProd <= 0)
          newErrors.unitAmountProd = "O valor deve ser maior que zero";
        if (!data.quantityProd || data.quantityProd <= 0)
          newErrors.quantityProd = "Quantidade deve ser maior que zero";
        break;

      case "exit":
        if (!data.status) newErrors.status = "Status é obrigatório";

        const totalPedido = data.quantityProd ?? 0;
        const totalSaidas = data.totalExited ?? 0;
        const precisaFinalizar = totalSaidas >= totalPedido && totalPedido > 0;

        const allowedStatuses = ["Finalizado", "Quitado"];
        const statusAtual = (data.status as any)?.name ?? "";

        if (precisaFinalizar && !allowedStatuses.includes(statusAtual)) {
          newErrors.status =
            "Favor alterar o status para 'Finalizado' ou 'Quitado'";
        }

        // 🔹 Bloqueia avanço/salvar se houver erro de quantidade (vindo do ExitData)
        if (data.exitError) {
          newErrors.quantityExit = data.exitError;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, stepsFiltered.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // 🔹 "Salvar" também grava a saída se existir e for válida
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validateStep()) return;

    const requestBody: any = { ...data };
    requestBody.entryDate = toYMD(data.entryDate) || "";
    requestBody.exitDate = toYMD(data.exitDate) || undefined;
    requestBody.unitAmountProd = normalizeNumber(data.unitAmountProd);
    requestBody.quantityProd = normalizeNumber(data.quantityProd);
    requestBody.unitAmountSubProd = normalizeNumber(data.unitAmountSubProd);
    requestBody.quantitySubProd = normalizeNumber(data.quantitySubProd);

    if (isEditing && id != null) requestBody.id = id;

    const request = isEditing
      ? orderService.updateRequest(requestBody)
      : orderService.insertRequest(requestBody);

    request
      .then((res) => {
        const savedOrderId = res.data?.id ?? id;
        const qtdSaida = Number(data.quantityExit ?? 0);
        const dataSaida = data.exitDate ? new Date(data.exitDate) : null;

        if (savedOrderId && qtdSaida > 0 && dataSaida) {
          const novaSaida: OrderExitDTO = {
            id: 0,
            order: { id: savedOrderId } as any,
            quantityProd: qtdSaida,
            exitDate: dataSaida,
          };
          return exitService.insertRequest(novaSaida);
        }
      })
      .then(() => navigate("/listingOrders"))
      .catch((e) => console.error("Erro ao salvar ordem/saída:", e));
  }

  return (
    <main>
      <section id="proj-order-step-section" className="proj-container">
        <div className="proj-order-step-container">
          <div className="proj-order-step-header">
            <h2 className="proj-mb20">
              {isEditing ? "Editar Ordem de Serviço" : "Cadastrar Ordem de Serviço"}
            </h2>
          </div>

          <div className="proj-order-step-form-container">
            <form className="proj-order-step-card proj-order-step" onSubmit={handleSubmit}>
              <div className="proj-order-step-inputs-container">
                {isEditing && (
                  <div className="proj-order-step-id">
                    <h5>Id: </h5>
                    <input
                      value={id ?? ""}
                      className="proj-order-step-entry-control"
                      disabled
                    />
                  </div>
                )}

                <Steps currentStep={currentStep} steps={stepsFiltered} />
              </div>

              <div className="proj-order-step-actions">
                <div>
                  {currentStep > 0 && (
                    <button type="button" onClick={handlePrevious}>
                      <GrFormPrevious />
                      <span>Voltar</span>
                    </button>
                  )}
                </div>

                <div>
                  {currentStep < stepsFiltered.length - 1 ? (
                    <button type="button" onClick={handleNext}>
                      <span>Avançar</span>
                      <GrFormNext />
                    </button>
                  ) : (
                    <div className="proj-order-step-button-primary">
                      <div>
                        <ButtonPrimary name="Salvar" />
                      </div>
                      <div className="proj-order-step-button-icon">
                        <FiSend />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
