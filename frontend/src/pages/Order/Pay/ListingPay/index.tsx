import "./styles.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayDTO } from "../../../../models/payDto";
import qs from "query-string";
import editIcon from "../../../../assets/pencil.svg";
import viewIcon from "../../../../assets/view.svg";
import deleteIcon from "../../../../assets/trash.svg";
import editIconOff from "../../../../assets/pencilOff.svg";
import deleteIconOff from "../../../../assets/trashOff.svg";
import * as PayService from "../../../../services/pay-service";
import Pagination from "../../../../components/Pagination";
import DialogConfirmation from "../../../../components/DialogConfirmation";
import { formatDateBR } from "../../../../utils/format";
import DialogViewPay from "../../../../components/DialogView/DialogViewPay";

type ControlComponentsData = {
  page: number;
  name: string;
};

type StatusName = "Finalizado";

const statusColors: Record<StatusName, string> = {
  Finalizado: "green",
};

export default function ListingPay() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dialogConfirmationData, setDialogConfirmationData] = useState({
    visible: false,
    id: 0,
    order: 0,
    message: "Tem certeza que quer deletar o registro:",
  });

  const [controlComponentsData, setControlComponentsData] =
    useState<ControlComponentsData>({
      page: getActualPage() || 0,
      name: "",
    });

  const [viewPayData, setViewPayData] = useState<{
    visible: boolean;
    pay: PayDTO | null;
  }>({
    visible: false,
    pay: null,
  });

  const [pay, setPay] = useState<PayDTO[]>([]);
  const [pageCounts, setPageCounts] = useState<number>(0);
  const [actualPage, setActualPage] = useState(getActualPage());

  function getActualPage() {
    const params = qs.parse(location.search);
    const page = params.page;
    return page ? Number(page) : 0;
  }

  const handlePageChange = (pageNumber: number) => {
    setActualPage(pageNumber);
    setControlComponentsData((prev) => ({ ...prev, page: pageNumber }));
  };

  useEffect(() => {
    PayService.findPageRequest(actualPage, controlComponentsData.name).then(
      (response) => {
        setPay(response.data.content);
        setPageCounts(response.data.totalPages);
      }
    );
  }, [actualPage, controlComponentsData.name]);

  function handleUpdate(payId: number) {
    navigate(`/listingPay/${payId}`);
  }

  function handleDelete(payId: number, orderId: number) {
    setDialogConfirmationData((prev) => ({
      ...prev,
      visible: true,
      id: payId,
      order: orderId,
    }));
  }

  function handleDialogConfirmationAnswer(answer: boolean, payId: number) {
    if (answer) {
      PayService.deleteRequest(payId).then(() => {
        setPay([]);
        window.location.reload();
      });
    }
    setDialogConfirmationData((prev) => ({ ...prev, visible: false }));
  }

  function handleView(pay: PayDTO) {
    setViewPayData({ visible: true, pay});
  }

  function handleCloseView() {
    setViewPayData({ visible: false, pay: null });
  }

  return (
    <main className="proj-pay-listing-card">
      <section id="proj-pay-listing-section" className="proj-container">
        <div className="proj-mt20">
          <div className="proj-pay-listing-title">
            <h2>Historico de Pagamentos</h2>
          </div>

          <div className="proj-pay-listing-content">
            <div className="proj-mt40 proj-mb20"></div>
          </div>

          <table className="proj-pay-listing-table proj-mb20 proj-mt20">
            <thead>
              <tr>
                <th>ID ORDEM</th>
                <th>STATUS</th>
                <th>FORNECEDOR</th>
                <th>PRODUTO</th>
                <th>DATA DO PAGAMENTO</th>
                <th>VALOR PAGO</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pay.map((pay) => (
                <tr key={pay.id}>
                  <td>{pay.order.id}</td>
                  <td
                    className={`proj-pay-listing-table-status ${statusColors[
                      pay.order.status.name as StatusName
                    ]}`}
                  >
                    {pay.order.status.name}
                  </td>
                  <td>{pay.order.supplier.name}</td>
                  <td>{pay.order.product.name}</td>
                  <td>{formatDateBR(pay.payDate)}</td>
                  <td>
                    R{"$ "}
                    {pay.payValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <img
                      src={viewIcon}
                      alt="Visualizar"
                      onClick={() => handleView(pay)}
                    />
                  </td>
                  <td>
                    {pay.order.status.id !== 4 ? (
                      <img
                        src={editIcon}
                        alt="Editar"
                        onClick={() => handleUpdate(pay.id)}
                      />
                    ) : (
                      <img
                        className="proj-pay-listing-icon-off"
                        src={editIconOff}
                        alt="Editar"
                      />
                    )}
                  </td>
                  <td>
                    {pay.order.status.id !== 4 ? (
                      <img
                        src={deleteIcon}
                        alt="Deletar"
                        onClick={() => handleDelete(pay.id, pay.order.id)}
                      />
                    ) : (
                      <img
                        className="proj-pay-listing-icon-off"
                        src={deleteIconOff}
                        alt="Deletar"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="proj-pay-listing-pagination">
            <Pagination
              pageCount={Number(pageCounts || 0)}
              range={3}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </section>

      {dialogConfirmationData.visible && (
        <DialogConfirmation
          id={dialogConfirmationData.id}
          message={dialogConfirmationData.message}
          onDialogAnswer={handleDialogConfirmationAnswer}
        />
      )}

      {viewPayData.visible && (
        <DialogViewPay
          visible={viewPayData.visible}
          pay={viewPayData.pay}
          onClose={handleCloseView}
        />
      )}
    </main>
  );
}
