import "./styles.css"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductDTO } from "../../../models/productDto";
import qs from 'query-string';
import editIcon from '../../../assets/pencil.svg';
import viewIcon from '../../../assets/view.svg';
import deleteIcon from '../../../assets/trash.svg';
import * as productService from "../../../services/product-service";
import ButtonPrimary from "../../../components/ButtonPrimary";
import Pagination from "../../../components/Pagination";
import DialogConfirmation from "../../../components/DialogConfirmation";
import ButtonSecondary from "../../../components/ButtonSecondary";
import DialogViewProduct from "../../../components/DialogView/DialogViewProduct";

type QueryParams = {
    page: number;
    name: string;
}

export default function ListingProduct() {
    
    const navigate = useNavigate();

    const location = useLocation()

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        product: "",
        message: "Tem certeza que quer deletar o registro: "
    })
    
    const [viewProductData, setViewProductData] = useState({
        visible: false,
        product: null as ProductDTO | null
    });

    const [queryParams] = useState<QueryParams>({
        page: getActualPage() || 0,
        name: "",
    });

    const [product, setproduct] = useState<ProductDTO[]>([])

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
        productService.findPageRequest(actualPage, queryParams.name)
            .then(response => {
                setproduct(response.data.content);
                setPageCounts(response.data.totalPages);
            });
    
    }, [actualPage, queryParams.name]);

    function handleNewProduct() {
        navigate("/listingProducts/create")
    };

    function handleSubProduct() {
        navigate("/listingSubProducts")
    };

    function handleUpdate(productId: number) {
        navigate(`/listingProducts/${productId}`);
    }

    function handleDelete(productId: number, productName: string) {
        setDialogConfirmationData(
            { 
                ...dialogConfirmationData, 
                id: productId, 
                product: productName,
                visible: true
            }
        );
    }

    function handleView(product: ProductDTO) {
        setViewProductData({ visible: true, product });
    }

    function handleCloseView() {
        setViewProductData({ visible: false, product: null });
    }

    function handleDialogConfirmationAnswer(answer: boolean, productId: number) {
        if (answer) {
            productService.deleteRequest(productId)
                .then(() => {
                    setproduct([]);
                    window.location.reload()
                })
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false});
    }    

    return (
        <main className="proj-product-listing-card">
            <section id="proj-product-listing-section" className="proj-container">
                <div className="proj-mt20">
                    <div className="proj-product-listing-title">
                        <h2>Listagem de Produtos</h2>
                    </div>

                    <div className="proj-product-listing-btn">
                        <div className="proj-mt40 proj-mb20 proj-product-listing-btn-primary">
                            <div onClick={handleNewProduct}>
                                <ButtonPrimary name='Novo' />
                            </div>
                        </div>

                        <div className="proj-mt40 proj-mb20">
                            <div onClick={handleSubProduct}>
                                <ButtonSecondary name='SubProduto' />
                            </div>
                        </div> 
                    </div>


                    <table className="proj-product-listing-table proj-mb20 proj-mt20">
                        <thead>
                            <tr>
                                <th className='proj-product-listing-table-id'>ID</th>
                                <th>NOME</th>
                                <th>DESCRIÇÃO</th>
                                <th>SUB-PRODUTO</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                product.map(product => (
                                    <tr key={product.id}>
                                        <td className='proj-product-listing-table-id'>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.subProduct?.name}</td>
                                        <td><img src={viewIcon} alt='Visualizar' onClick={() => {handleView(product)}}/></td>
                                        <td><img src={editIcon} alt='Editar' onClick={() => {handleUpdate(product.id)}}/></td>
                                        <td><img src={deleteIcon} alt='Deletar' onClick={() => handleDelete(product.id, product.name)}/></td>
                                    </tr>                                
                                ))
                            }
                        </tbody>
                    </table>

                    <div className="proj-product-listing-pagination">
                        <Pagination 
                            pageCount={Number((pageCounts) ? pageCounts : 0)}
                            range={3}
                            onChange={handlePageChange}
                        />
                        
                    </div>

                </div>
            </section>
            
            {
                dialogConfirmationData.visible &&
                <DialogConfirmation
                    id={dialogConfirmationData.id}
                    product={dialogConfirmationData.product}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            }

            {viewProductData.visible &&
                <DialogViewProduct
                    visible={viewProductData.visible}
                    product={viewProductData.product}
                    onClose={handleCloseView}
                />
            }
        </main>
    )
}
