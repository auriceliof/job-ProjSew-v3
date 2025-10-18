import "./styles.css"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SubProductDTO } from "../../../../models/subProductDto";
import qs from 'query-string';
import editIcon from '../../../../assets/pencil.svg';
import viewIcon from '../../../../assets/view.svg';
import deleteIcon from '../../../../assets/trash.svg';
import * as subProductService from "../../../../services/subproduct-service";
import ButtonPrimary from "../../../../components/ButtonPrimary";
import Pagination from "../../../../components/Pagination";
import DialogConfirmation from "../../../../components/DialogConfirmation";
import ButtonSecondary from "../../../../components/ButtonSecondary";
import DialogViewSubProduct from "../../../../components/DialogView/DialogViewSubProduct";

type QueryParams = {
    page: number;
    name: string;
}

export default function ListingSubProduct() {
    
    const navigate = useNavigate();

    const location = useLocation()

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        subProduct: "",
        message: "Tem certeza que quer deletar o registro: "
    })

    const [viewSubProductData, setViewSubProductData] = useState({
        visible: false,
        subProduct: null as SubProductDTO | null
    });
    
    const [queryParams] = useState<QueryParams>({
        page: getActualPage() || 0,
        name: "",
    });

    const [subProduct, setSubProduct] = useState<SubProductDTO[]>([])

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
        subProductService.findPageRequest(actualPage, queryParams.name)
            .then(response => {
                setSubProduct(response.data.content);
                setPageCounts(response.data.totalPages);
            });
    
    }, [actualPage, queryParams.name]);

    function handleNewSubProduct() {
        navigate("/listingSubProducts/create")
    };

    function handleProduct() {
        navigate("/listingProducts")
    };

    function handleUpdate(subProductId: number) {
        navigate(`/listingSubProducts/${subProductId}`);
    }

    function handleDelete(subProductId: number, subProductName: string) {
        setDialogConfirmationData(
            { 
                ...dialogConfirmationData, 
                id: subProductId, 
                subProduct: subProductName,
                visible: true
            }
        );
    }

    function handleView(subProduct: SubProductDTO) {
        setViewSubProductData({ visible: true, subProduct })
    }

    function handleCloseView() {
        setViewSubProductData({ visible: false, subProduct: null })
    }

    function handleDialogConfirmationAnswer(answer: boolean, subProductId: number) {
        if (answer) {
            subProductService.deleteRequest(subProductId)
                .then(() => {
                    setSubProduct([]);
                    window.location.reload()
                })
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false});
    }    

    return (
        <main className="proj-subproduct-listing-card">
            <section id="proj-subproduct-listing-section" className="proj-container">
                <div className="proj-mt20">
                    <div className="proj-subproduct-listing-title">
                        <h2>Listagem de Sub-Produtos</h2>
                    </div>

                    <div className="proj-subproduct-listing-btn">
                         <div className="proj-mt40 proj-mb20 proj-subproduct-listing-btn-primary">
                            <div className="proj-subproduct-listing-btn" onClick={handleNewSubProduct}>
                                <ButtonPrimary name='Novo' />
                            </div>
                         </div>

                         <div className="proj-mt40 proj-mb20">
                            <div onClick={handleProduct}>
                                <ButtonSecondary name='Produto' />
                            </div>
                        </div>
                    </div>

                    <table className="proj-subproduct-listing-table proj-mb20 proj-mt20">
                        <thead>
                            <tr>
                                <th className='proj-subproduct-listing-table-id'>ID</th>
                                <th>NOME</th>
                                <th>DESCRIÇÃO</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody> 
                            {
                                subProduct.map(subProduct => (
                                    <tr key={subProduct.id}>
                                        <td className='proj-subproduct-listing-table-id'>{subProduct.id}</td>
                                        <td>{subProduct.name}</td>
                                        <td>{subProduct.description}</td>
                                        <td><img src={viewIcon} alt='Visualizar' onClick={() => {handleView(subProduct)}}/></td>
                                        <td><img src={editIcon} alt='Editar' onClick={() => {handleUpdate(subProduct.id)}}/></td>
                                        <td><img src={deleteIcon} alt='Deletar' onClick={() => handleDelete(subProduct.id, subProduct.name)}/></td>
                                    </tr>                                
                                ))
                            }
                        </tbody>
                    </table>

                    <div className="proj-subproduct-listing-pagination">
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
                    subProduct={dialogConfirmationData.subProduct}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            }

            {viewSubProductData.visible &&
                <DialogViewSubProduct
                    visible={viewSubProductData.visible}
                    subProduct={viewSubProductData.subProduct}
                    onClose={handleCloseView}
                />
            }
        </main>
    )
}
