import './styles.css';

type Props = {
  visible: boolean;
  product: {
    id: number;
    name: string;
    description: string;
    subProduct?: { name: string };
  } | null;
  onClose: () => void;
};

export default function DialogViewProduct({ visible, product, onClose }: Props) {
  if (!visible || !product) return null;

  return (
    <div className="proj-dialog-product-overlay">
      <div className="proj-dialog-product-box">
        <h2>Produto</h2>
        <div className="proj-dialog-product-content">
          <p><strong>ID:</strong> {product.id}</p>
          <p><strong>Nome:</strong> {product.name}</p>
          <p><strong>Descrição:</strong> {product.description}</p>

          {product.subProduct?.name &&
            <p><strong>Sub-Produto:</strong> {product.subProduct?.name || "Nenhum"}</p>
          }

        </div>

        <div className="proj-dialog-product-actions">
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
