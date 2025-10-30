import "./styles.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import editIcon from "../../../../assets/pencil.svg";
import viewIcon from "../../../../assets/view.svg";
import deleteIcon from "../../../../assets/trash.svg";
import * as OrderExitService from "../../../../services/orderexit-service";
import Pagination from "../../../../components/Pagination";
import DialogConfirmation from "../../../../components/DialogConfirmation";
import { formatDateBR } from "../../../../utils/format";
import DialogViewExits from "../../../../components/DialogView/DialogViewExits";
import { OrderExitDTO } from "../../../../models/orderExitDto";
import { OrderDTO } from "../../../../models/orderDto";

type ControlComponentsData = {
  page: number;
  name: string;
};

export default function ListingExits() {
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

  const [viewExitsData, setViewExitsData] = useState<{
    visible: boolean;
    exits: OrderExitDTO[];
    order: OrderDTO | null;
  }>({
    visible: false,
    exits: [],
    order: null,
  });

  const [exits, setExits] = useState<OrderExitDTO[]>([]);
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
    OrderExitService.findPageRequest(
      actualPage,
      controlComponentsData.name
    ).then((response) => {
      setExits(response.data.content);
      setPageCounts(response.data.totalPages);
    });
  }, [actualPage, controlComponentsData.name]);

  function handleUpdate(exitId: number) {
    navigate(`/ListingExits/${exitId}`);
  }

  function handleDelete(exitId: number, orderId: number) {
    setDialogConfirmationData((prev) => ({
      ...prev,
      visible: true,
      id: exitId,
      order: orderId,
    }));
  }

  function handleDialogConfirmationAnswer(answer: boolean, exitId: number) {
    if (answer) {
      OrderExitService.deleteRequest(exitId).then(() => {
        setExits([]);
        window.location.reload();
      });
    }
    setDialogConfirmationData((prev) => ({ ...prev, visible: false }));
  }

  // ✅ novo: agrupa todas as saídas do mesmo pedido
  function handleView(exit: OrderExitDTO) {
    const orderId = exit.order.id;
    const exitsDoPedido = exits.filter((e) => e.order.id === orderId);
    setViewExitsData({
      visible: true,
      exits: exitsDoPedido,
      order: exit.order,
    });
  }

  function handleCloseView() {
    setViewExitsData({ visible: false, exits: [], order: null });
  }

  return (
    <main className="proj-pay-listing-card">
      <section id="proj-pay-listing-section" className="proj-container">
        <div className="proj-mt20">
          <div className="proj-pay-listing-title">
            <h2>Histórico de Saída das Ordens</h2>
          </div>

          <div className="proj-pay-listing-content">
            <div className="proj-mt40 proj-mb20"></div>
          </div>

          <table className="proj-pay-listing-table proj-mb20 proj-mt20">
            <thead>
              <tr>
                <th>ID SAÍDA</th>
                <th>ID ORDEM</th>
                <th>FORNECEDOR</th>
                <th>PRODUTO</th>
                <th>DATA DE SAÍDA</th>
                <th>QUANTIDADE SAÍDA</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exits.map((ex) => (
                <tr key={ex.id}>
                  <td>{ex.id}</td>
                  <td>{ex.order.id}</td>
                  <td>{ex.order.supplier.name}</td>
                  <td>{ex.order.product.name}</td>
                  <td>{formatDateBR(ex.exitDate)}</td>
                  <td>{ex.quantityProd}</td>
                  <td>
                    <img
                      src={viewIcon}
                      alt="Visualizar"
                      onClick={() => handleView(ex)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    <img
                      src={editIcon}
                      alt="Editar"
                      onClick={() => handleUpdate(ex.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    <img
                      src={deleteIcon}
                      alt="Deletar"
                      onClick={() => handleDelete(ex.id, ex.order.id)}
                      style={{ cursor: "pointer" }}
                    />
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

      {viewExitsData.visible && (
        <DialogViewExits
          visible={viewExitsData.visible}
          exits={viewExitsData.exits}
          order={viewExitsData.order}
          onClose={handleCloseView}
        />
      )}
    </main>
  );
}
