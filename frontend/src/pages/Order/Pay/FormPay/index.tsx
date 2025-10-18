import "./styles.css";
import ButtonSecondary from "../../../../components/ButtonSecondary";
import ButtonPrimary from "../../../../components/ButtonPrimary";
import ReactSelect from "react-select";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { requestBackend } from "../../../../utils/requests";
import { useEffect, useState } from "react";
import * as forms from "../../../../utils/forms";
import * as orderService from "../../../../services/order-service";
import * as payService from "../../../../services/pay-service";
import { OrderDTO } from "../../../../models/orderDto";

export default function FormPay() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEditing = params.payId !== "create";
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  const [formData] = useState<any>({});
  const [selectOrder, setSelectOrder] = useState<OrderDTO[]>([]);
  const [id, setId] = useState("");
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [payDate, setPayDate] = useState("");
  const [payValue, setPayValue] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    payDate: "",
    payValue: "",
    order: "",
  });

  // Carregar ordens
  useEffect(() => {
    requestBackend({ url: "/orders" }).then((response) => {
      const orders = response.data.content;
      const filtered = isEditing
        ? orders.filter((o: OrderDTO) => o.status.id === 3)
        : orders;
      setSelectOrder(filtered);
    });
  }, [isEditing]);

  // orderId via query
  useEffect(() => {
    if (orderId) {
      orderService.findById(Number(orderId)).then((response) => {
        setId(response.data.id.toString());
        setOrder(response.data);
      });
    }
  }, [orderId]);

  // Editando pagamento
  useEffect(() => {
    if (isEditing) {
      payService.findById(Number(params.payId)).then((response) => {
        setId(response.data.id.toString());
        setPayDate(response.data.payDate);
        setPayValue(response.data.payValue);
        setOrder(response.data.order);
      });
    }
  }, [isEditing, params.payId]);

  // Cálculo do devido
  const amountDue = order
    ? Math.max(order.totalAmount - order.paidValue, 0)
    : 0;

  // Formatador moeda
  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);

  // Variante visual do box
  const summaryVariant = !order ? "" : amountDue === 0 ? "ok" : "warn";

  // Validações
  function validateOrder(selected: OrderDTO | null) {
    if (!selected || selected.id == null) {
      setErrorMessage((prev) => ({
        ...prev,
        order: "Deve escolher uma Ordem de Serviço",
      }));
    } else {
      setErrorMessage((prev) => ({ ...prev, order: "" }));
    }
  }

  function validatePayDate(value: string) {
    if (!value) {
      setErrorMessage((prev) => ({
        ...prev,
        payDate: "A data não pode ser nula.",
      }));
    } else if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(value)) {
      setErrorMessage((prev) => ({
        ...prev,
        payDate: "A data deve estar no formato yyyy-mm-dd",
      }));
    } else {
      setErrorMessage((prev) => ({ ...prev, payDate: "" }));
    }
  }

  function validatePayValue(value: string) {
    const numeric = Number(value.replace(",", "."));
    if (isNaN(numeric) || numeric < 0) {
      setErrorMessage((prev) => ({
        ...prev,
        payValue: "O valor deve ser um número positivo",
      }));
      return;
    }
    if (order && numeric > amountDue) {
      setErrorMessage((prev) => ({
        ...prev,
        payValue: `O valor não pode exceder o devido (${fmt(amountDue)})`,
      }));
      return;
    }
    setErrorMessage((prev) => ({ ...prev, payValue: "" }));
  }

  // Submit
  function handleSubmit(event: any) {
    event.preventDefault();

    let hasError = false;

    if (!order || order.id == null) {
      setErrorMessage((prev) => ({
        ...prev,
        order: "Deve escolher uma Ordem de Serviço",
      }));
      hasError = true;
    }

    if (!payDate) {
      setErrorMessage((prev) => ({
        ...prev,
        payDate: "A data não pode ser nula.",
      }));
      hasError = true;
    } else if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(payDate)) {
      setErrorMessage((prev) => ({
        ...prev,
        payDate: "A data deve estar no formato yyyy-mm-dd",
      }));
      hasError = true;
    }

    const numericPayValue = Number(payValue.replace(",", "."));
    if (isNaN(numericPayValue) || numericPayValue < 0) {
      setErrorMessage((prev) => ({
        ...prev,
        payValue: "O valor deve ser um número positivo",
      }));
      hasError = true;
    } else if (order && numericPayValue > amountDue) {
      setErrorMessage((prev) => ({
        ...prev,
        payValue: `O valor não pode exceder o devido (${fmt(amountDue)})`,
      }));
      hasError = true;
    }

    if (hasError) return;

    const requestBody = forms.toValues(formData);
    requestBody.id = id;
    requestBody.order = order;
    requestBody.payDate = payDate;
    requestBody.payValue = numericPayValue;

    const request = isEditing
      ? payService.updateRequest(requestBody)
      : payService.insertRequest(requestBody);

    request.then(() => {
      navigate("/listingOrdersPay");
    });
  }

  // Render
  return (
    <main>
      <section id="proj-pay-form-section" className="proj-container">
        <div className="proj-pay-form-container">
          <form
            className="proj-pay-form-card proj-pay-form"
            onSubmit={handleSubmit}
          >
            {isEditing ? (
              <div className="proj-container">
                <div className="proj-pay-id">
                  <h5>Id:</h5>
                  <input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="proj-pay-form-control"
                    disabled
                  />
                </div>
                <h2 className="proj-mb20">Editar Pagamento</h2>
              </div>
            ) : (
              <h2 className="proj-mb20">Novo Pagamento</h2>
            )}

            <div className="proj-pay-form-controls-container">
              <div>
                <h5>Ordem de Serviço</h5>
                <ReactSelect<OrderDTO, false>
                  options={selectOrder}
                  classNamePrefix="proj-pay-form-control"
                  value={order}
                  placeholder="Escolha uma opção"
                  isDisabled={!!orderId}
                  getOptionLabel={(select) => String(select.id)}
                  getOptionValue={(select) => String(select.id)}
                  onChange={(selected) => {
                    setOrder(selected as OrderDTO);
                    validateOrder(selected as OrderDTO);
                  }}
                />
                {errorMessage.order && (
                  <div className="proj-pay-form-error">
                    {errorMessage.order}
                  </div>
                )}
              </div>

              <div>
                <h5>Data do Pagamento</h5>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => {
                    setPayDate(e.target.value);
                    validatePayDate(e.target.value);
                  }}
                  className="proj-pay-form-control"
                />
                {errorMessage.payDate && (
                  <div className="proj-pay-form-error">
                    {errorMessage.payDate}
                  </div>
                )}
              </div>

              <div>
                <h5>Valor Pago</h5>
                <input
                  type="number"
                  value={payValue}
                  placeholder="R$"
                  onChange={(e) => {
                    setPayValue(e.target.value);
                    validatePayValue(e.target.value);
                  }}
                  className="proj-pay-form-control"
                  step="0.01"
                  min="0"
                />
                {errorMessage.payValue && (
                  <div className="proj-pay-form-error">
                    {errorMessage.payValue}
                  </div>
                )}
              </div>
            </div>

            {/* Box de resumo no rodapé */}
            {order && (
              <div
                className={`proj-pay-summary ${summaryVariant}`}
                role="status"
                aria-live="polite"
              >
                <div className="proj-pay-summary-header">
                  <span className="proj-pay-summary-icon">💰</span>
                  <h6>Resumo do Pagamento</h6>
                </div>

                <div className="summary-grid">
                  <span className="summary-label">Valor total</span>
                  <span className="summary-value">
                    {fmt(order.totalAmount)}
                  </span>

                  <span className="summary-label">Pago</span>
                  <span className="summary-value">{fmt(order.paidValue)}</span>
                </div>

                <hr className="summary-divider" />

                <div className="summary-grid">
                  <span className="summary-label">Devido</span>
                  <span className="summary-value">{fmt(amountDue)}</span>
                </div>
              </div>
            )}

            <div className="proj-pay-form-buttons">
              {isEditing ? (
                <Link to="/listingPay">
                  <ButtonSecondary name="Cancelar" />
                </Link>
              ) : (
                <Link to="/listingOrdersPay">
                  <ButtonSecondary name="Cancelar" />
                </Link>
              )}
              <ButtonPrimary name="Salvar" />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
