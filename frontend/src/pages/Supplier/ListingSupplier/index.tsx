import './styles.css';
import qs from 'query-string';
import editIcon from '../../../assets/pencil.svg';
import viewIcon from '../../../assets/view.svg';
import deleteIcon from '../../../assets/trash.svg';
import ButtonPrimary from '../../../components/ButtonPrimary';
import DialogConfirmation from '../../../components/DialogConfirmation';
import Pagination from '../../../components/Pagination';
import { useEffect, useState } from 'react';
import { SupplierDTO } from '../../../models/supplierDto';
import { useLocation, useNavigate } from 'react-router-dom';
import * as supplierService from "../../../services/supplier-service";
import DialogViewsupplier from '../../../components/DialogView/DialogViewSupplier';

type QueryParams = {
    page: number;
    name: string;
}

export default function ListingSupplier() {

    const navigate = useNavigate();

    const location = useLocation();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        supplier: "",
        message: "Tem certeza que quer deletar esse registro?"
    });
    
    const [queryParams] = useState<QueryParams>({
        page: getActualPage() || 0,
        name: "",
    });

    const [viewSupplierData, setViewSupplierData] = useState ({
        visible: false,
        supplier: null as SupplierDTO | null
    });

    const [supplier, setSupplier] = useState<SupplierDTO[]>([])

    const [pageCounts, setPageCounts] = useState();

    const [actualPage, setActualPage] = useState(getActualPage());

    function getActualPage() {
        const params = qs.parse(location.search);
        const page = params.page;
        return page ? Number(page) : 0;
    }

    const handlePageChange = (pageNumber: number) => {
        setActualPage(pageNumber);
        const params = qs.parse(location.search);
        navigate({
            search: qs.stringify({ ...params, page: pageNumber })
        });
    };
      
    useEffect(() => {
        supplierService.findPageRequest(actualPage, queryParams.name)
            .then(response => {
                setSupplier(response.data.content);
                setPageCounts(response.data.totalPages);
            });
    
    }, [actualPage, queryParams.name]);

    function handleNewProduct() {
        navigate("/listingSuppliers/create")
    };

    function handleUpdate(supplierId: number) {
        navigate(`/listingSuppliers/${supplierId}`);
    }

    function handleDelete(supplierId: number, supplierName: string) {
        setDialogConfirmationData(
            { 
                ...dialogConfirmationData, 
                id: supplierId, 
                supplier: supplierName, 
                visible: true
            }
        );
    }

    function handleDialogConfirmationAnswer(answer: boolean, supplierId: number) {
        if (answer) {
            supplierService.deleteRequest(supplierId)
                .then(() => {
                    setSupplier([]);
                    window.location.reload()
                })
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false});
    }   
    
    function handleView(supplier: SupplierDTO) {
        setViewSupplierData({visible: true, supplier})
    }

    function handleCloseView() {
        setViewSupplierData({visible: false, supplier: null})
    }

    return (
        <main className='proj-supplier-listing-card'>
            <section id="proj-supplier-listing-section" className="proj-container">
                <div className="proj-mt20">
                    <div className='proj-supplier-listing-title'>
                        <h2>Listagem de Fornecedores</h2>
                    </div>

                    <div className="proj-mt40 proj-mb20">
                        <div className="proj-supplier-listing-btn" onClick={handleNewProduct}>
                            <ButtonPrimary name='Novo' />
                        </div>
                    </div>

                    <table className="proj-supplier-listing-table proj-mb20 proj-mt20">
                        <thead>
                            <tr>
                                <th className='proj-supplier-listing-table-id'>ID</th>
                                <th>NOME</th>
                                <th>CONTATO</th>
                                <th>CPF</th>
                                <th>ENDEREÇO</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody> 
                            {
                                supplier.map(supplier => (
                                    <tr key={supplier.id}>
                                        <td className='proj-supplier-listing-table-id'>{supplier.id}</td>
                                        <td>{supplier.name}</td>
                                        <td>{supplier.contact}</td>
                                        <td>{supplier.cpf}</td>
                                        <td>{supplier.address}</td>
                                        <td><img src={viewIcon} alt='Visualizar' onClick={() => {handleView(supplier)}}/></td>
                                        <td><img src={editIcon} alt='Editar' onClick={() => {handleUpdate(supplier.id)}}/></td>
                                        <td><img src={deleteIcon} alt='Deletar' onClick={() => handleDelete(supplier.id, supplier.name)}/></td>
                                    </tr>                                
                                ))
                            }
                        </tbody>
                    </table>

                    <div className="proj-supplier-listing-pagination">
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
                    supplier={dialogConfirmationData.supplier}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            }

            {viewSupplierData.visible &&
                <DialogViewsupplier
                    visible={viewSupplierData.visible}
                    supplier={viewSupplierData.supplier}
                    onClose={handleCloseView}
                />
            }
        </main>
    )
}
