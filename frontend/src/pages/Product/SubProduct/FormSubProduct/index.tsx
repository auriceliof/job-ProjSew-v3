import "./styles.css";
import ButtonSecondary from "../../../../components/ButtonSecondary";
import ButtonPrimary from "../../../../components/ButtonPrimary";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as forms from "../../../../utils/forms";
import * as subProductService from "../../../../services/subproduct-service";

export default function FormSubProduct() {
  const params = useParams();
  const navigate = useNavigate();
  const isEditing = params.subProductId !== "create";

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (isEditing) {
      subProductService.findById(Number(params.subProductId)).then((response) => {
        setId(response.data.id);
        setName(response.data.name);
        setDescription(response.data.description);
      });
    }
  }, [isEditing, params.subProductId]);

  function validateName(value: string) {
    if (!value.trim()) {
      return "Nome é obrigatório";
    }
    if (value.trim().length < 5 || value.trim().length > 50) {
      return "Nome deve ter entre 5 e 50 caracteres";
    }
    return "";
  }

  function validateDescription(value: string) {
    if (!value.trim()) {
      return "Descrição é obrigatória";
    }
    if (value.trim().length < 10 || value.trim().length > 100) {
      return "Descrição deve ter entre 10 e 100 caracteres";
    }
    return "";
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    const nameError = validateName(name);
    const descriptionError = validateDescription(description);

    setErrors({
      name: nameError,
      description: descriptionError,
    });

    if (nameError || descriptionError) {
      return;
    }

    const requestBody = forms.toValues({});
    requestBody.id = id;
    requestBody.name = name;
    requestBody.description = description;

    if (isEditing) {
      requestBody.id = params.subProductId;
    }

    const request = isEditing
      ? subProductService.updateRequest(requestBody)
      : subProductService.insertRequest(requestBody);

    request.then(() => {
      navigate("/listingSubProducts");
    });
  }

  return (
    <main>
      <section id="proj-subproduct-form-section" className="proj-container">
        <div className="proj-subproduct-form-container">
          <form
            className="proj-subproduct-card proj-subproduct-form"
            onSubmit={handleSubmit}
          >
            {isEditing ? (
              <div className="proj-container">
                <div className="proj-subproduct-id">
                  <h5>Id:</h5>
                  <input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="proj-subproduct-form-control"
                    disabled
                  />
                </div>
                <h2 className="proj-mb20">Editar Sub-Produto</h2>
              </div>
            ) : (
              <h2 className="proj-mb20">Cadastrar Sub-Produto</h2>
            )}

            <div className="proj-subproduct-form-controls-container">
              <div>
                <h5>Nome</h5>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      name: validateName(e.target.value),
                    }));
                  }}
                  className="proj-subproduct-form-control"
                />
                {errors.name && (
                  <div className="proj-subproduct-form-error">{errors.name}</div>
                )}
              </div>
              <div>
                <h5>Descrição</h5>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      description: validateDescription(e.target.value),
                    }));
                  }}
                  className="proj-subproduct-form-control"
                />
                {errors.description && (
                  <div className="proj-subproduct-form-error">
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            <div className="proj-subproduct-form-buttons">
              <Link to="/listingSubProducts">
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
