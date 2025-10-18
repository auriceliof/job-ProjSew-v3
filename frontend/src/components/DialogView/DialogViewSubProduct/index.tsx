import './styles.css';

type Props = {
  visible: boolean;
  subProduct: {
    id: number;
    name: string;
    description: string;
  } | null;
  onClose: () => void;
  
};

export default function DialogViewSubProduct({ visible, subProduct, onClose }: Props) {
  if (!visible || !subProduct) return null;

  return (
    <div className="proj-dialog-subproduct-overlay">
      <div className="proj-dialog-subproduct-box">
        <h2>Sub-Produto</h2>
        <div className="proj-dialog-subproduct-content">
          <p><strong>ID:</strong> {subProduct.id}</p>
          <p><strong>Nome:</strong> {subProduct.name}</p>
          <p><strong>Descrição:</strong> {subProduct.description}</p>
        </div>

        <div className="proj-dialog-subproduct-actions">
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
