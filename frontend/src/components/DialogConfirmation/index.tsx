import './styles.css';
import ButtonPrimary from '../ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary';

type Props = {
    id: number;
    supplier?: string;
    user?: string;
    product?: string;
    subProduct?: string;
    message: string;
    onDialogAnswer: Function;
}
export default function DialogConfirmation( {id, product, subProduct, supplier, user, message, onDialogAnswer} : Props) {

    return (
        <div className="proj-dialog-background" onClick={() => onDialogAnswer(false, id)}>
            <div className="proj-dialog-box" onClick={(event) => event.stopPropagation()}>
                <div className="proj-dialog-info">
                    <h2>{message}</h2>
                    <div className='proj-dialog-content'>
                        <h4 className='proj-dialog-content-id'>ID:</h4>
                        <h5>{id}</h5>
                    </div>
                    
                    {product && (
                        <div className='proj-dialog-content'>
                            <h4 className='proj-dialog-content-product'>PRODUTO:</h4>
                            <h5>{product}</h5>
                        </div>
                    )}
                    {subProduct && (
                        <div className='proj-dialog-content'>
                            <h4 className='proj-dialog-content-product'>SUB-PRODUTO:</h4>
                            <h5>{subProduct}</h5>
                        </div>
                    )}
                    {supplier && !product && (
                        <div className='proj-dialog-content'>
                            <h4 className='proj-dialog-content-supplier'>FORNECEDOR:</h4>
                            <h5>{supplier}</h5>
                        </div>
                    )}
                     {user && (
                        <div className='proj-dialog-content'>
                            <h4 className='proj-dialog-content-user'>USUARIO:</h4>
                            <h5>{user}</h5>
                        </div>
                    )}

                </div>

                <div className="proj-dialog-btn">
                    <div onClick={() => onDialogAnswer(false, id)}>
                        <ButtonSecondary name="Não"/>
                    </div>
                    <div onClick={() => onDialogAnswer(true, id)}>
                        <ButtonPrimary name="Sim"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
