import "./styles.css";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import { requestBackend } from "../../../../utils/requests";
import * as orderService from "../../../../services/order-service";
import { ProductDTO } from "../../../../models/productDto";
import { SubProductDTO } from "../../../../models/subProductDto";

type Props = {
  data: any;
  updateFildHandle: (k: string, v: any) => void;
  errors: any;

  // 🔧 vindos do pai (FormOrderStep)
  isEditing: boolean;
  orderId?: number | null;
};

export default function ProductData({
  data,
  updateFildHandle,
  errors,
  isEditing,
  orderId,
}: Props) {
  const [selectProduct, setSelectProduct] = useState<ProductDTO[]>([]);
  const [selectSubProduct, setSelectSubProduct] = useState<SubProductDTO[]>([]);

  // Carrega produtos
  useEffect(() => {
    let ignore = false;

    requestBackend({
      url: "/products",
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        if (ignore) return;
        setSelectProduct(response.data?.content ?? []);
      })
      .catch((e) => {
        console.error("Falha ao carregar produtos:", e);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Carrega subprodutos
  useEffect(() => {
    let ignore = false;

    requestBackend({
      url: "/subproducts",
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        if (ignore) return;
        setSelectSubProduct(response.data?.content ?? []);
      })
      .catch((e) => {
        console.error("Falha ao carregar subprodutos:", e);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Hidrata dados do produto somente em edição
  useEffect(() => {
    if (!isEditing) return;
    if (!orderId || !Number.isFinite(orderId)) return;

    let ignore = false;

    orderService
      .findById(orderId)
      .then((response) => {
        if (ignore) return;
        updateFildHandle("product", response.data.product);
        updateFildHandle("unitAmountProd", response.data.unitAmountProd);
        updateFildHandle("quantityProd", response.data.quantityProd);
        updateFildHandle("subProduct", response.data.subProduct);
        updateFildHandle("unitAmountSubProd", response.data.unitAmountSubProd);
        updateFildHandle("quantitySubProd", response.data.quantitySubProd);
      })
      .catch((e) => {
        console.error("Falha ao carregar dados (ProductData):", e);
      });

    return () => {
      ignore = true;
    };
  }, [isEditing, orderId]);

  
  return (
    <div className="proj-order-step-product-container">
      <div className="proj-container">
        <h2 className="proj-mb20"> Produto </h2>
      </div>

      <div className="proj-order-step-product-controls-container">
        <div>
          <h5>Produto</h5>
          <ReactSelect
            options={selectProduct}
            classNamePrefix="proj-order-step-product-control"
            value={data.product || null}
            placeholder="Escolha uma opção"
            isClearable
            autoFocus
            getOptionLabel={(opt: ProductDTO) => opt.name}
            getOptionValue={(opt: ProductDTO) => String(opt.id)}
            onChange={(selected) => {
              updateFildHandle("product", selected);
              // quando troca o produto, zera subproduto e seus campos
              if (!selected?.hasSubProd) {
                updateFildHandle("subProduct", null);
                updateFildHandle("unitAmountSubProd", "");
                updateFildHandle("quantitySubProd", "");
              }
            }}
          />
          {errors.product && <p className="error-text">{errors.product}</p>}
        </div>

        <div>
          <h5>Valor Unitário do Produto</h5>
          <input
            type="number"
            value={data.unitAmountProd ?? ""}
            placeholder="R$"
            onChange={(e) =>
              updateFildHandle(
                "unitAmountProd",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="proj-order-step-product-control"
          />
          {errors.unitAmountProd && (
            <p className="error-text">{errors.unitAmountProd}</p>
          )}
        </div>

        <div>
          <h5>Quantidade do Produto</h5>
          <input
            type="number"
            value={data.quantityProd ?? ""}
            placeholder="0"
            onChange={(e) =>
              updateFildHandle(
                "quantityProd",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="proj-order-step-product-control"
          />
          {errors.quantityProd && (
            <p className="error-text">{errors.quantityProd}</p>
          )}
        </div>

        {data.product?.hasSubProd && (
          <>
            <div>
              <h5>Sub-Produto</h5>
              <ReactSelect
                options={selectSubProduct}
                classNamePrefix="proj-order-step-product-control"
                value={data.subProduct || null}
                placeholder="Escolha uma opção"
                isClearable
                getOptionLabel={(opt: SubProductDTO) => opt.name}
                getOptionValue={(opt: SubProductDTO) => String(opt.id)}
                onChange={(selected) => {
                  updateFildHandle("subProduct", selected);
                  // se limpar o subproduto, zera campos relacionados
                  if (!selected) {
                    updateFildHandle("unitAmountSubProd", "");
                    updateFildHandle("quantitySubProd", "");
                  }
                }}
              />
              {errors.subProduct && (
                <p className="error-text">{errors.subProduct}</p>
              )}
              {errors.unitAmountSubProd && (
                <p className="error-text">{errors.unitAmountSubProd}</p>
              )}
              {errors.quantitySubProd && (
                <p className="error-text">{errors.quantitySubProd}</p>
              )}
            </div>

            {data.subProduct && (
              <>
                <div>
                  <h5>Valor Unitário do Sub-Produto</h5>
                  <input
                    type="number"
                    value={data.unitAmountSubProd ?? ""}
                    placeholder="R$"
                    onChange={(e) =>
                      updateFildHandle(
                        "unitAmountSubProd",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className={`proj-order-step-entry-control ${
                      errors.unitAmountSubProd ? "error" : ""
                    }`}
                  />
                </div>

                <div>
                  <h5>Multiplicador (x1)</h5>
                  <input
                    type="number"
                    value={data.quantitySubProd ?? ""}
                    placeholder="0"
                    onChange={(e) =>
                      updateFildHandle(
                        "quantitySubProd",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className={`proj-order-step-entry-control ${
                      errors.quantitySubProd ? "error" : ""
                    }`}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
