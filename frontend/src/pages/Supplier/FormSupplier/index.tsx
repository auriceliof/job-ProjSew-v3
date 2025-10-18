import "./styles.css";
import ButtonSecondary from "../../../components/ButtonSecondary";
import ButtonPrimary from "../../../components/ButtonPrimary";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import * as forms from "../../../utils/forms";
import * as supplierService from "../../../services/supplier-service";

export default function FormSupplier() {
  const params = useParams();
  const navigate = useNavigate();
  const isEditing = params.supplierId !== "create";

  const [formData] = useState<any>({});

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [cpf, setCpf] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    name: '',
    contact: '',
    cpf: '',
    address: ''
  });

  useEffect(() => {
    if (isEditing) {
      supplierService.findById(Number(params.supplierId)).then((response) => {
        setId(response.data.id);
        setName(response.data.name);
        setContact(response.data.contact);
        setCpf(response.data.cpf);
        setAddress(response.data.address);
      });
    }
  }, [isEditing, params.supplierId]);

  function validateName(value: string) {
    if (value.trim().length < 5 || value.trim().length > 50) {
      setErrorMessage(prevState => ({ ...prevState, name: 'Nome deve ter entre 5 e 50 caracteres' }));
    } else {
      setErrorMessage(prevState => ({ ...prevState, name: '' }));
    }
  }

  function validateAddress(value: string) {
    if (value.trim().length < 10 || value.trim().length > 100) {
      setErrorMessage(prevState => ({ ...prevState, address: 'Endereço deve ter entre 10 e 100 caracteres' }));
    } else {
      setErrorMessage(prevState => ({ ...prevState, address: '' }));
    }
  }

  function handleSubmit(event: any) {
   
    event.preventDefault();

    let hasError = false;

    if (name.trim().length < 5 || name.trim().length > 50) {
      setErrorMessage(prevState => ({ ...prevState, name: 'Nome deve ter entre 5 e 50 caracteres' }));
      hasError = true;
    } else {
      setErrorMessage(prevState => ({ ...prevState, name: '' }));
    }

    if (address.trim().length < 10 || address.trim().length > 100) {
      setErrorMessage(prevState => ({ ...prevState, address: 'Endereço deve ter entre 10 e 100 caracteres' }));
      hasError = true;
    } else {
      setErrorMessage(prevState => ({ ...prevState, address: '' }));
    }

    if (contact) {
      if (/^\(?([1-9]{2})\)?\s?([9]{1})?([0-9]{4})-?([0-9]{4})$/.test(contact)) {
        setErrorMessage(prevState => ({ ...prevState, contact: '' }));
      } else {
        setErrorMessage(prevState => ({ ...prevState, contact: 'Favor informar um contato válido' }));
        hasError = true;
      }
    }

    if (cpf) {
      if (/^(([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}))$/.test(cpf)) {
        setErrorMessage(prevState => ({ ...prevState, cpf: '' }));
      } else {
        setErrorMessage(prevState => ({ ...prevState, cpf: 'Favor informar um CPF válido' }));
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    const requestBody = forms.toValues(formData);
    requestBody.id = id;
    requestBody.name = name;
    requestBody.contact = contact;
    requestBody.cpf = cpf;
    requestBody.address = address;

    if (isEditing) {
      requestBody.id = params.supplierId;
    }

    const request = isEditing
      ? supplierService.updateRequest(requestBody)
      : supplierService.insertRequest(requestBody);

    request.then(() => {
      navigate("/listingSuppliers");
    });
  }

  return (
    <main>
      <section id="proj-supplier-form-section" className="proj-container">
        <div className="proj-supplier-form-container">
          <form className="proj-supplier-card proj-supplier-form" onSubmit={handleSubmit}>
            
          { isEditing && 
              isEditing ? (

                <div className="proj-container">
                  <div className="proj-supplier-id">
                    <h5>Id:</h5>
                      <input
                        value={id}
                        onChange={(e) => {
                          setId(e.target.value);
                        }}
                        className="proj-supplier-form-control"
                        disabled
                      />
                  </div>
                  <h2 className="proj-mb20"> Editar Fornecedor </h2>
                </div>                               
              ) : (                
                <h2 className="proj-mb20"> Cadastrar Fornecedor </h2>
              )               
            }  
            <div className="proj-supplier-form-controls-container">
              <div>
                <h5>Nome</h5>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateName(e.target.value);
                  }}
                  className="proj-supplier-form-control"
                />
                {errorMessage.name && 
                  <div className="proj-supplier-form-error">{errorMessage.name}</div>}
              </div>
              <div>
                <h5>Contato</h5>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={contact}
                  onAccept={(valueContact) => setContact(valueContact)}
                  className="proj-supplier-form-control"
                />
                {errorMessage.contact && 
                  <div className="proj-supplier-form-error">{errorMessage.contact}</div>}
              </div>
              <div>
                <h5>CPF</h5>
                <IMaskInput
                  mask="000.000.000-00"
                  value={cpf}
                  onAccept={(valueCpf) => setCpf(valueCpf)}
                  className="proj-supplier-form-control"
                />
                {errorMessage.cpf && 
                  <div className="proj-supplier-form-error">{errorMessage.cpf}</div>}
              </div>
              <div>
                <h5>Endereço</h5>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    validateAddress(e.target.value);
                  }}
                  className="proj-supplier-form-control"
                />
                {errorMessage.address && 
                  <div className="proj-supplier-form-error">{errorMessage.address}</div>}
              </div>
            </div>
            <div className="proj-supplier-form-buttons">
              <Link to="/listingSuppliers">
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
