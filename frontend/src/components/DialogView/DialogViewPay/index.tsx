import './styles.css';
import { PayDTO } from '../../../models/payDto';
import { formatDateBR } from '../../../utils/format';

type Props = {
  visible: boolean;
  pay: PayDTO | null;
  onClose: () => void;
};

export default function DialogViewPay({ visible, pay, onClose }: Props) {
  if (!visible || !pay) return null;

  return (
    <div className="proj-dialog-pay-overlay">
      <div className="proj-dialog-pay-box">
        <h2>Pagamento</h2>

        <div className="proj-dialog-pay-content">
          <p><strong>Id da Ordem:</strong> {pay.order.id}</p>
          <p><strong>Fornecedor: </strong>{pay.order.supplier.name}</p>
          <p><strong>Data do Pagamento:</strong> {formatDateBR(pay.payDate)}</p>
          <p>
            <strong>Valor Pago:</strong>{' '}
            {pay.payValue.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>

        <div className="proj-dialog-pay-actions">
          <button type="button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
