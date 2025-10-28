import "./styles.css";
import { formatDateBR } from "../../../../utils/format";
import { useParams } from "react-router-dom";

type Props = {
  data: any;
};

export default function ConfirmationData({ data }: Props) {
  const params = useParams();

  const isEditing = params.orderId !== "create";

  return (
    <div className="proj-order-step-confirmation-container">
      <div>
        <h2 className="proj-mb40"> Confirmação de Dados </h2>
      </div>

      <div className="proj-order-step-confirmation-controls-container">
        <div className="proj-order-step-confirmation-controls-content">
          <h5>Data de Entrada :</h5>
          <h6>{formatDateBR(data.entryDate)}</h6>
        </div>
        <div className="proj-order-step-confirmation-controls-content">
          <h5>Fornecedor :</h5>
          <h6>{data.supplier.name}</h6>
        </div>
        <div className="proj-order-step-confirmation-controls-content">
          <h5>Produto :</h5>
          <h6>{data.product.name}</h6>
        </div>
        <div className="proj-order-step-confirmation-controls-content">
          <h5>Valor Unitário do Produto :</h5>
          <h6>{data.unitAmountProd}</h6>
        </div>

        <div className="proj-order-step-confirmation-controls-content">
          <h5>Quantidade do Produto :</h5>
          <h6>{data.quantityProd}</h6>
        </div>

        {
          data.subProduct &&(
            <div>
              <div className="proj-order-step-confirmation-controls-content">
                <h5>Sub-Produto :</h5>
                <h6>{data.subProduct.name}</h6>
              </div>
              <div className="proj-order-step-confirmation-controls-content">
                <h5>Valor Unitário do Sub-Produto :</h5>
                <h6>{data.unitAmountSubProd}</h6>
              </div>
              <div className="proj-order-step-confirmation-controls-content">
                <h5>Quantidade do Sub-Produto :</h5>
                <h6>{data.quantitySubProd}</h6>
              </div>
            </div>
          )
        }

        {isEditing && (
          <div>
            {
              data.status.name &&
              <div className="proj-order-step-confirmation-controls-content">
                <h5>Status :</h5>
                <h6>{data.status.name}</h6>
              </div>
            }

            {data.exitDate && (
              <div className="proj-order-step-confirmation-controls-content">
                <h5>Data de Saída :</h5>
                <h6>{formatDateBR(data.exitDate)}</h6>
              </div>
            )}

            {
              data.quantityExit &&
              <div className="proj-order-step-confirmation-controls-content">
                <h5>Quantidade Saída :</h5>
                <h6>{data.quantityExit}</h6>
              </div>
            }

          </div>
        )}
      </div>
    </div>
  );
}
