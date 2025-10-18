import "./styles.css"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderDTO } from "../../../models/orderDto";
import qs from 'query-string';
import viewIcon from '../../../assets/view.svg';
import moneyIcon from '../../../assets/money.svg';
import * as OrderService from "../../../services/order-service";
import ButtonPrimary from "../../../components/ButtonPrimary";
import Pagination from "../../../components/Pagination";
import { formatDateBR } from "../../../utils/format";
import { OrderFilterData } from "../../../components/OrderFilter";
import DialogViewOrderPay from "../../../components/DialogView/DialogViewOrderPay";

type ControlCompnentsData = {
    page: number;
    name: string;
    filterData: OrderFilterData;
};

type StatusName = 'Aguardando' | 'Produção' | 'Finalizado' | 'Quitado';

const statusColors: Record<StatusName, string> = {
    'Aguardando': 'red',
    'Produção': 'yellow',
    'Finalizado': 'green',
    'Quitado': 'gray',
};

export default function ListingOrderPay() {
    const navigate = useNavigate();
    const location = useLocation()

    const defaultFilterData: OrderFilterData = {
        selectStatus: { id: 3, name: 'Finalizado' },
        selectProduct: null 
    };

    const [controlCompnentsData, setControlCompnentsData] = useState<ControlCompnentsData>({
      page: getActualPage() || 0,
      name: '',
      filterData: defaultFilterData
    });

    const [viewOrderPayData, setViewOrderPayData] = useState<{
        visible: boolean;
        order: OrderDTO | null;
    }>({
        visible: false,
        order: null,
    });

    const [order, setOrder] = useState<OrderDTO[]>([]);
    const [pageCounts, setPageCounts] = useState<number>();
    const [actualPage, setActualPage] = useState(getActualPage());

    function getActualPage() {
        const params = qs.parse(location.search);
        const page = params.page;
        return page ? Number(page) : 0;
    }

    const handlePageChange = (pageNumber: number) => {
        setActualPage(pageNumber);
        setControlCompnentsData({
            ...controlCompnentsData,
            page: pageNumber
        });
    };

    useEffect(() => {
        const statusId = controlCompnentsData.filterData.selectStatus ? controlCompnentsData.filterData.selectStatus.id : null;
        const productId = controlCompnentsData.filterData.selectProduct ? controlCompnentsData.filterData.selectProduct.id : null;

        OrderService.findPageRequest(actualPage, controlCompnentsData.name, statusId, productId)
            .then(response => {
                setOrder(response.data.content);
                setPageCounts(response.data.totalPages);
            });
    }, [actualPage, controlCompnentsData]);

    const handleNewPay = (orderId: number) => {
        navigate(`/listingPay/create?orderId=${orderId}`);
    };

    const handleHistoryPay = () => {
        navigate("/listingPay");
    };

    function handleView(order: OrderDTO) {
        setViewOrderPayData({visible: true, order});
    }

    function handleCloseView() {
        setViewOrderPayData({visible: false, order: null});
    }

    return (
        <main className="proj-order-pay-card">
            <section id="proj-order-pay-section" className="proj-container">
                <div className="proj-mt20">
                    <div className="proj-order-pay-title">
                        <h2>Ordens para Pagamento</h2>
                    </div>

                    <div className="proj-order-pay-content">
                        <div className="proj-mt40 proj-mb20">
                            <div className="proj-order-pay-btn" onClick={handleHistoryPay}>
                                <ButtonPrimary name='Histórico' />
                            </div>                            
                        </div>
                    </div>

                    <table className="proj-order-pay-table proj-mb20 proj-mt20">
                        <thead>
                            <tr>
                                <th className='proj-order-pay-table-id'>ID</th>
                                <th>ENTRADA</th>
                                <th>FORNECEDOR</th>
                                <th>PRODUTO</th>
                                <th>QUANTIDADE</th>
                                <th>SAÍDA</th>
                                <th>VALOR TOTAL</th>
                                <th>VALOR PAGO</th>
                                <th>RESTA PAGAR</th>
                                <th>STATUS</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody> 
                            {order.map(order => (
                                <tr key={order.id}>
                                    <td className='proj-order-pay-table-id'>{order.id}</td>
                                    <td>{formatDateBR(order.entryDate)}</td>
                                    <td>{order.supplier.name}</td>
                                    <td>{order.product.name}</td>
                                    <td>{order.quantityProd}</td>
                                    <td>{formatDateBR(order.exitDate)}</td>
                                    <td className='proj-order-pay-table-totalamount'>R$ {order.totalAmount.toFixed(2)}</td>
                                    <td className='proj-order-pay-table-paidvalue'>R$ {order.paidValue.toFixed(2)}</td>
                                    <td className='proj-order-pay-table-amount-rest'>
                                        R$ {(order.totalAmount - order.paidValue).toFixed(2)}</td>
                                    <td className={`proj-order-pay-table-status ${statusColors[order.status.name as StatusName]}`}>
                                        {order.status.name}
                                    </td>
                                    <td>
                                        <img 
                                            src={viewIcon}
                                            alt="Visualizar"
                                            onClick={() => handleView(order)}
                                        />
                                    </td>
                                    <td>
                                        <img src={moneyIcon} alt='Pagar' onClick={() => handleNewPay(order.id)} />
                                    </td>
                                </tr>                                
                            ))}
                        </tbody>
                    </table>

                    <div className="proj-order-pay-pagination">
                        <Pagination 
                            pageCount={Number((pageCounts) ? pageCounts : 0)}
                            range={3}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </section>

            {viewOrderPayData.visible &&
                <DialogViewOrderPay 
                    visible={viewOrderPayData.visible}
                    order={viewOrderPayData.order}
                    onClose={handleCloseView}
                />
            }
            
        </main>
    )
}
