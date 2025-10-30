import "./styles.css";
import { formatDateBR } from "../../../utils/format";
import { OrderDTO } from "../../../models/orderDto";

type ExitItem = {
  id: number;
  exitDate: Date;
  quantityProd: number;
};

type Props = {
  visible: boolean;
  exits: ExitItem[];   
  order: OrderDTO | null; 
  onClose: () => void;
};

export default function DialogViewExits({ visible, exits, order, onClose }: Props) {
  if (!visible || !exits || !order) return null;

  const totalSaidas = exits.reduce((acc, item) => acc + (item.quantityProd || 0), 0);
  const faltaSair = (order.quantityProd || 0) - totalSaidas;

  return (
    <div className="proj-dialog-order-exits-overlay">
      <div className="proj-dialog-order-box">
        <h2>REGISTRO DE SAÍDAS</h2>
        <div className="proj-dialog-order-exits-content">
          <h4><strong>DADOS DA ORDEM</strong></h4>
          <p><strong>Id:</strong> {order.id}</p>
          <p><strong>Produto:</strong> {order.product?.name}</p>
          <p><strong>Quantidade Total:</strong> {order.quantityProd}</p>
        </div>

        <div className="proj-dialog-order-exits-content">
          <h4><strong>SAÍDAS REALIZADAS</strong></h4>
          {exits.length > 0 ? (
            <table className="proj-dialog-order-exits-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Data</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {exits.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{formatDateBR(item.exitDate)}</td>
                    <td>{item.quantityProd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma saída registrada.</p>
          )}
        </div>

        <div className="proj-dialog-order-exits-content resumo">
          <h4><strong>RESUMO</strong></h4>
          <p><strong>Total já Saído:</strong> {totalSaidas}</p>
          <p><strong>Falta Sair:</strong> {faltaSair > 0 ? faltaSair : 0}</p>
        </div>

        <div className="proj-dialog-order-exits-actions">
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
