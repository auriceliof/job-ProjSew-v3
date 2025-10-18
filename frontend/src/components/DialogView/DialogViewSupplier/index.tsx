import './styles.css';

type Props = {
  visible: boolean;
  supplier: {
    id: number;
    name: string;
    contact: string;
    cpf: string;
    address: string;
  } | null;
  onClose: () => void;
};

   

export default function DialogViewSupplier({ visible, supplier, onClose }: Props) {
  if (!visible || !supplier) return null;

  return (
    <div className="proj-dialog-supplier-overlay">
      <div className="proj-dialog-supplier-box">
        <h2>Fornecedor</h2>
        <div className="proj-dialog-supplier-content">
          <p><strong>ID:</strong> {supplier.id}</p>
          <p><strong>Nome:</strong> {supplier.name}</p>
          <p><strong>Contato:</strong> {supplier.contact}</p>
          <p><strong>CPF:</strong> {supplier.cpf}</p>
          <p><strong>Endereço:</strong> {supplier.address}</p>
        </div>

        <div className="proj-dialog-supplier-actions">
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
