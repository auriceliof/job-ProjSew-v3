import './styles.css';
import { formatDateBR } from '../../../utils/format';

type Props = {
  visible: boolean;
  order: {
    id: number;
    entryDate: Date;
    unitAmountProd: number;
    quantityProd: number;
    unitAmountSubProd: number;
    quantitySubProd: number;
    exitDate: Date;
    totalAmount: number;
    paidValue: number;
    isPaid: boolean;
    endOs: Date;
    status: { name: string };
    supplier: { name: string };
    product: { name: string };
    subProduct?: { name: string } | null;
  } | null;
  onClose: () => void;
};

export default function DialogViewOrder({ visible, order, onClose }: Props) {
  if (!visible || !order) return null;

  return (
    <div className="proj-dialog-order-overlay">
      <div className="proj-dialog-order-box">
        <h2>Ordem de Serviço</h2>
        <div className="proj-dialog-order-content">
          <h4>ENTRADA</h4>
          <p><strong>Id:</strong> {order.id}</p>
          <p><strong>Data:</strong> {formatDateBR(order.entryDate)}</p>
          <p><strong>Fornecedor:</strong> {order.supplier.name}</p>
        </div>  
        <div className="proj-dialog-order-content">
          <h4><strong>PRODUTO</strong></h4>
          <p><strong>Nome:</strong> {order.product.name}</p>
          <p><strong>Valor: </strong> 
            R$ {(order.unitAmountProd.toFixed(2))}
          </p>
          <p><strong>Quantidade:</strong> {order.quantityProd}</p>
        </div>
        
        {order.subProduct?.name &&
          <div className="proj-dialog-order-content">
            <h4><strong>SUB-PRODUTO</strong></h4>  
            <p><strong>Nome:</strong> {order.subProduct?.name}</p>
            <p><strong>Valor: </strong> 
              R$ {(order.unitAmountSubProd.toFixed(2))}
            </p>
            <p><strong>Multiplicador:</strong> {order.quantitySubProd}</p>
          </div>  
        }  

        <div className="proj-dialog-order-content">
          <h4><strong>SAÍDA:</strong></h4>      
          <p><strong>Total: </strong> 
            R$ {(order.totalAmount.toFixed(2))}
          </p>
          {order.exitDate &&
            <p><strong>Data:</strong> {formatDateBR(order.exitDate)}</p>
          }

          <p><strong>Valor Pago: </strong> 
            R$ {(order.paidValue.toFixed(2))}
          </p>
          <p><strong>Status:</strong> {order.status.name}</p>
        </div>

        <div className="proj-dialog-order-actions">
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
