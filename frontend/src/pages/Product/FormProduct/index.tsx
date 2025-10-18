import "./styles.css";
import ButtonSecondary from "../../../components/ButtonSecondary";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as forms from "../../../utils/forms";
import * as productService from "../../../services/product-service";
import { SubProductDTO } from "../../../models/subProductDto";
import { requestBackend } from "../../../utils/requests";
import ReactSelect from "react-select";

export default function FormProduct() {
  const params = useParams();
  const navigate = useNavigate();
  const isEditing = params.productId !== "create";

  const [formData] = useState<any>({});

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subProduct, setSubProduct] = useState<SubProductDTO | null>();

  const [selectSubProduct, setSelectSubProduct] = useState<SubProductDTO[]>([]);

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    description: "",
    subProduct: "",
  });

  useEffect(() => {
    requestBackend({
      url: "/subproducts",
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        setSelectSubProduct(response.data.content);
      })
      .catch((err) => {
        console.error("Erro ao carregar subprodutos:", err);
      });
  }, []);

  useEffect(() => {
    if (isEditing) {
      productService.findById(Number(params.productId)).then((response) => {
        setId(response.data.id);
        setName(response.data.name);
        setDescription(response.data.description);
        setSubProduct(response.data.subProduct);
      });
    }
  }, [isEditing, params.productId]);

  function validateName(value: string) {
    if (value.trim().length < 5 || value.trim().length > 50) {
      setErrorMessage((prevState) => ({
        ...prevState,
        name: "Nome deve ter entre 5 e 50 caracteres",
      }));
    } else {
      setErrorMessage((prevState) => ({ ...prevState, name: "" }));
    }
  }

  function validatedescription(value: string) {
    if (value.trim().length < 10 || value.trim().length > 100) {
      setErrorMessage((prevState) => ({
        ...prevState,
        description: "Descrição deve ter entre 10 e 100 caracteres",
      }));
    } else {
      setErrorMessage((prevState) => ({ ...prevState, description: "" }));
    }
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    let hasError = false;

    if (name.trim().length < 5 || name.trim().length > 50) {
      setErrorMessage((prevState) => ({
        ...prevState,
        name: "Nome deve ter entre 5 e 50 caracteres",
      }));
      hasError = true;
    } else {
      setErrorMessage((prevState) => ({ ...prevState, name: "" }));
    }

    if (description.trim().length < 10 || description.trim().length > 100) {
      setErrorMessage((prevState) => ({
        ...prevState,
        description: "Descrição deve ter entre 10 e 100 caracteres",
      }));
      hasError = true;
    } else {
      setErrorMessage((prevState) => ({ ...prevState, description: "" }));
    }

    if (hasError) {
      return;
    }

    const requestBody = forms.toValues(formData);
    requestBody.id = id;
    requestBody.name = name;
    requestBody.description = description;
    requestBody.subProduct = subProduct;

    if (isEditing) {
      requestBody.id = params.productId;
    }

    const request = isEditing
      ? productService.updateRequest(requestBody)
      : productService.insertRequest(requestBody);

    request.then(() => {
      navigate("/listingProducts");
    });
  }

  return (
    <main>
      <section id="proj-product-form-section" className="proj-container">
        <div className="proj-product-form-container">
          <form
            className="proj-product-card proj-product-form"
            onSubmit={handleSubmit}
          >
            {isEditing && isEditing ? (
              <div className="proj-container">
                <div className="proj-product-id">
                  <h5>Id:</h5>
                  <input
                    value={id}
                    onChange={(e) => {
                      setId(e.target.value);
                    }}
                    className="proj-product-form-control"
                    disabled
                  />
                </div>
                <h2 className="proj-mb20"> Editar Produto </h2>
              </div>
            ) : (
              <h2 className="proj-mb20"> Cadastrar Produto </h2>
            )}

            <div className="proj-product-form-controls-container">
              <div>
                <h5>Nome</h5>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateName(e.target.value);
                  }}
                  className="proj-product-form-control"
                />
                {errorMessage.name && (
                  <div className="proj-product-form-error">
                    {errorMessage.name}
                  </div>
                )}
              </div>
              <div>
                <h5>Descrição</h5>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    validatedescription(e.target.value);
                  }}
                  className="proj-product-form-control"
                />
                {errorMessage.description && (
                  <div className="proj-product-form-error">
                    {errorMessage.description}
                  </div>
                )}
              </div>

              <div>
                <h5>Sub-produto</h5>
                <ReactSelect
                  options={selectSubProduct}
                  classNamePrefix="proj-subproduct-form-control"
                  value={subProduct}
                  placeholder="Escolha uma opção"
                  isClearable
                  getOptionLabel={(select: SubProductDTO) => select.name}
                  getOptionValue={(select: SubProductDTO) => String(select.id)}
                  onChange={(selectedOption) => {
                    setSubProduct(selectedOption);
                  }}
                />
              </div>
            </div>
            <div className="proj-product-form-buttons">
              <Link to="/listingProducts">
                <ButtonSecondary name="Cancelar" />
              </Link>
              <ButtonPrimary name="Salvar" />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
