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
import { Steps } from "../../../components/FormSteps/OderSteps/Steps";
import { AiOutlineProduct, AiOutlineUser } from "react-icons/ai";
import { FaIndent } from "react-icons/fa6";
import * as orderService from "../../../services/order-service";

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

// ✅ Modelo de formulário adaptado ao UI:
// - Datas como string "YYYY-MM-DD" (combina com <input type="date">)
// - Demais campos opcionais (preenchidos ao longo dos steps)
type FormData = Partial<
  Omit<OrderDTO, "entryDate" | "exitDate">
> & {
  entryDate?: string;
  exitDate?: string;
};

export default function FormOrderStep() {
  const navigate = useNavigate();
  const { orderId } = useParams<RouteParams>();

  // 🔧 Corrige detecção de modo
  const isCreate = !orderId || orderId === "create";
  const isEditing = !isCreate;

  const [id, setId] = useState<number | null>(null);

  const [data, setData] = useState<FormData>({
    status: { id: 1 } as any,
    subProduct: null as any,
  });

  const [errors, setErrors] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);

  // ✅ Função estrita + adaptador compatível com filhos (key: string, value: any)
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

  // Definição de passos com key estável para validar por semântica
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
        enable: isEditing, // só aparece no modo edição
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

  // 🔧 Buscar dados apenas em edição, normalizando payload e datas
  useEffect(() => {
    if (!isEditing || !orderId) return;

    const idNum = Number(orderId);
    if (!Number.isFinite(idNum)) return;

    orderService
      .findById(idNum)
      .then((response) => {
        // aceita tanto { orderDto: {...}, id } quanto um objeto "flat" {...}
        const root = response.data ?? {};
        const fetchedData: any = root.orderDto ?? root;

        // ID pode estar em root.id, fetchedData.id, ou cair no próprio idNum
        const resolvedId: number = root.id ?? fetchedData?.id ?? idNum;
        setId(resolvedId);

        setData({
          supplier: fetchedData?.supplier ?? null,
          product: fetchedData?.product ?? null,
          subProduct: fetchedData?.subProduct ?? null,

          // ✅ datas como string "YYYY-MM-DD" (compatível com <input type="date">)
          entryDate: toYMD(fetchedData?.entryDate),
          exitDate: toYMD(fetchedData?.exitDate),

          unitAmountProd: normalizeNumber(fetchedData?.unitAmountProd),
          quantityProd: normalizeNumber(fetchedData?.quantityProd),
          unitAmountSubProd: normalizeNumber(fetchedData?.unitAmountSubProd),
          quantitySubProd: normalizeNumber(fetchedData?.quantitySubProd),

          status: fetchedData?.status ?? ({ id: 1 } as any),
        });
      })
      .catch((e) => {
        console.error("Falha ao carregar a ordem para edição:", e);
      });
  }, [isEditing, orderId]);

  // 🔧 Validação baseada no passo ativo por key (não por índice)
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

        if (data.subProduct) {
          if (!data.unitAmountSubProd || !data.quantitySubProd)
            newErrors.subProduct =
              "Favor definir o valor e um multiplicador para o subproduto";
        }

        if (data.unitAmountSubProd && !data.subProduct)
          newErrors.unitAmountSubProd =
            "Foi definido o valor do subproduto. Selecione um subproduto";

        if (data.quantitySubProd && !data.subProduct)
          newErrors.quantitySubProd =
            "Foi definido um multiplicador para o subproduto. Selecione um subproduto";
        break;

      case "exit":
        if (!data.status) newErrors.status = "Status é obrigatório";

        if (data.exitDate) {
          const allowedStatuses = ["Finalizado", "Quitado"];
          const statusNormalized = (data.status as any)?.name;
          if (!allowedStatuses.includes(statusNormalized)) {
            newErrors.exitDate = "Foi definida uma data de saída";
            newErrors.status = "Favor alterar o status para 'Finalizado' ou 'Quitado'";
          }
        }
        break;

      case "confirm":
        // sem validação extra
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validateStep()) return;

    const requestBody: any = { ...data };

    // ✅ normalize datas antes de enviar (strings "YYYY-MM-DD")
    requestBody.entryDate = toYMD(data.entryDate) || "";
    requestBody.exitDate = toYMD(data.exitDate) || undefined;

    // ✅ garanta que campos numéricos não sejam enviados como ""
    requestBody.unitAmountProd = normalizeNumber(data.unitAmountProd);
    requestBody.quantityProd = normalizeNumber(data.quantityProd);
    requestBody.unitAmountSubProd = normalizeNumber(data.unitAmountSubProd);
    requestBody.quantitySubProd = normalizeNumber(data.quantitySubProd);

    if (isEditing && id != null) {
      requestBody.id = id; // garante numérico
    }

    const request = isEditing
      ? orderService.updateRequest(requestBody)
      : orderService.insertRequest(requestBody);

    request.then(() => {
      navigate("/listingOrders");
    });
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

                {/* 🔧 Use a lista filtrada de passos para o componente de passos */}
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
