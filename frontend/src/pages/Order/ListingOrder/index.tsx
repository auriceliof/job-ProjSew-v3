import "./styles.css"
import qs from 'query-string';
import viewIcon from '../../../assets/view.svg';
import editIcon from '../../../assets/pencil.svg';
import deleteIcon from '../../../assets/trash.svg';
import editIconOff from '../../../assets/pencilOff.svg';
import deleteIconOff from '../../../assets/trashOff.svg';
import ButtonPrimary from "../../../components/ButtonPrimary";
import Pagination from "../../../components/Pagination";
import DialogConfirmation from "../../../components/DialogConfirmation";
import ButtonSecondary from "../../../components/ButtonSecondary";
import * as OrderService from "../../../services/order-service";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderDTO } from "../../../models/orderDto";
import { formatDateBR } from "../../../utils/format";
import Filter, { OrderFilterData } from "../../../components/OrderFilter";
import DialogViewOrder from "../../../components/DialogView/DialogViewOrder";
import ButtonTertiary from "../../../components/ButtonTertiary";

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

export default function ListingOrder() {
    
    const navigate = useNavigate();

    const location = useLocation()

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        product: "",
        supplier: "",
        message: "Tem certeza que quer deletar o registro:"
    })

    const [controlCompnentsData, setControlCompnentsData] =
    useState<ControlCompnentsData>({
      page: getActualPage() || 0,
      name: '',
      filterData: {selectStatus: null, selectProduct: null}
    });

    const [viewOrderData, setViewOrderData] = useState<{
        visible: boolean;
        order: OrderDTO | null;
    }>({
        visible: false,
        order: null,
    });

    const [order, setOrder] = useState<OrderDTO[]>([])

    const [pageCounts, setPageCounts] = useState();

    const [actualPage, setActualPage] = useState(getActualPage());

    
    function getActualPage() {
        const params = qs.parse(location.search);
        const page = params.page;
        return page ? Number(page) : 0;
    }

    const handlePageChange = (pageNumber : number) => {
        setActualPage(pageNumber);
        setControlCompnentsData({ page: pageNumber, name: '', filterData: controlCompnentsData.filterData })
      }
    
      const handleSubmitFilter = ( data : OrderFilterData ) => {
        setControlCompnentsData({ page: 0, name: '', filterData: data })
      }

    useEffect(() => {

        const statusId = controlCompnentsData.filterData.selectStatus ? controlCompnentsData.filterData.selectStatus.id : null;
        const productId = controlCompnentsData.filterData.selectProduct ? controlCompnentsData.filterData.selectProduct.id : null;
        
        OrderService.findPageRequest(actualPage, controlCompnentsData.name, statusId, productId)
            .then(response => {
                setOrder(response.data.content);
                setPageCounts(response.data.totalPages);
            });
    
    }, [actualPage, controlCompnentsData]);

    function handleNewOrder() {
        navigate("/listingOrders/create")
    };

    function handlePay() {
        navigate("/listingOrdersPay")
    };

    function handleExits() {
        navigate("/listingExists")
    };

    function handleUpdate(orderId: number) {
        navigate(`/listingOrders/${orderId}`);
    }

    function handleDelete(OrderId: number, productName: string, supplierName: string) {
        setDialogConfirmationData(
            { 
                ...dialogConfirmationData,
                visible: true, 
                id: OrderId, 
                product: productName,
                supplier: supplierName,
            });
    }    

    function handleDialogConfirmationAnswer(answer: boolean, OrderId: number) {
        if (answer) {
            OrderService.deleteRequest(OrderId)
                .then(() => {
                    setOrder([]);
                    window.location.reload();
                });
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleView(order: OrderDTO){
        setViewOrderData({visible: true, order})
    }

    function handleCloseView(){
        setViewOrderData({visible: false, order: null})
    }

    return (
        <main className="proj-order-listing-card">
            <section id="proj-order-listing-section" className="proj-order-container">
                <div className="proj-mt20">
                    <div className="proj-order-listing-title">
                        <h2>Listagem das Ordens de Serviços</h2>
                    </div>

                    <div className="proj-order-listing-content">
                        <div className="proj-order-listing-content-btn proj-mb20">
                            <div className="proj-order-listing-btn" onClick={handleNewOrder}>
                                <ButtonPrimary name='Novo' />
                            </div>
                            <div className="proj-order-listing-btn" onClick={handlePay}>
                                <ButtonSecondary name='Pagamento' />
                            </div>
                             <div className="proj-order-listing-btn" onClick={handleExits}>
                                <ButtonTertiary name='Histórico de Saídas' />
                            </div>
                        </div>

                        <div>
                            <Filter onSubmitFilter={handleSubmitFilter}/>
                        </div>
                    </div>

                    <table className="proj-order-listing-table proj-mb20 proj-mt20">
                        <thead>
                            <tr className="tb-1">
                                <th></th>
                                <th>ENTRADA</th>
                                <th></th>
                                <th className="border-none"></th>
                                <th>PRODUTO</th>
                                <th></th>
                                <th className="border-none"></th>
                                <th>SUB-PRODUTO</th>
                                <th></th>
                                <th className="border-none"></th>
                                <th></th>
                                <th>SAÍDA</th>
                                <th></th>
                            </tr>
                            <tr className="tb-2">
                                <th className='proj-order-listing-table-id'>ID</th>
                                <th>DATA</th>
                                <th className='proj-order-listing-table-div'>FORNECEDOR</th>
                                <th>PRODUTO</th>
                                <th>VALOR (R$)</th>
                                <th>QUANTIDADE</th>
                                <th>SUB</th>
                                <th>VALOR (R$)</th>
                                <th>MULTIPLICADOR (x1)</th>
                                <th>TOTAL (R$)</th>
                                <th>DATA</th>
                                <th>PAGO (R$)</th>
                                <th>STATUS</th>
                                <th>QUITADO</th>
                                <th className="border-none"></th>
                                <th className="border-none"></th>
                                <th className="border-none"></th>
                            </tr>
                        </thead>
                        <tbody> 
                            {
                                order.map(order => (
                                    <tr key={order.id} className="border-t">
                                        <td className='proj-order-listing-table-id'>{order.id}</td>
                                        <td>{formatDateBR(order.entryDate)}</td>
                                        <td>{order.supplier.name}</td>
                                        <td>{order.product.name}</td>
                                        <td>{order.unitAmountProd.toFixed(2)}</td>
                                        <td>{order.quantityProd}</td>
                                        <td>{order.subProduct?.name}</td>
                                        <td>{order.unitAmountSubProd?.toFixed(2)}</td>
                                        <td>{order.quantitySubProd}</td>
                                        <td className='proj-order-listing-table-amount'>{order.totalAmount.toFixed(2)}</td>
                                        <td>{formatDateBR(order.exitDate)}</td>
                                        <td className='proj-order-listing-table-amount'>{order.paidValue.toFixed(2)}</td>
                                        <td className={`proj-order-listing-table-status 
                                            ${statusColors[order.status.name as StatusName]}`}>{order.status.name}</td>
                                        <td>{formatDateBR(order.endOs)}</td>
                                        <td>
                                            <img 
                                                src={viewIcon}
                                                alt="Visualizar"
                                                onClick={() => handleView(order)}
                                            />
                                        </td>
                                        <td>
                                            {order.status.id !== 4 ? (
                                                <img src={editIcon} alt='Editar' onClick={() => {handleUpdate(order.id)}}/>
                                            ):(
                                                <img className="proj-order-listing-icon-off" src={editIconOff} alt='Editar'/>
                                            )}
                                        </td>    
                                        <td>
                                            {order.status.id !== 4 ? (
                                                <img src={deleteIcon} alt='Deletar' onClick={() => handleDelete(order.id, order.product.name, order.supplier.name)}/>
                                            ):(
                                                <img className="proj-order-listing-icon-off" src={deleteIconOff} alt='Deletar'/>
                                            )}
                                        </td>
                                    </tr>                                
                                ))
                            }
                        </tbody>
                    </table>

                    <div className="proj-order-listing-pagination">
                        <Pagination 
                            pageCount={Number((pageCounts) ? pageCounts : 0)}
                            range={3}
                            onChange={handlePageChange}
                        />
                        
                    </div>
                </div>

            </section>
            
            {dialogConfirmationData.visible &&
                <DialogConfirmation
                    id={dialogConfirmationData.id}
                    product={dialogConfirmationData.product}
                    supplier={dialogConfirmationData.supplier}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            }

            {viewOrderData.visible &&
                <DialogViewOrder 
                    visible={viewOrderData.visible}
                    order={viewOrderData.order}
                    onClose={handleCloseView}
                />
            }

        </main>
    )
}
