import "./styles.css";
import ReactSelect from "react-select";
import { requestBackend } from "../../utils/requests";
import { StatusDTO } from "../../models/statusDto";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import searchIcon from "../../assets/search.svg";
import { ProductDTO } from "../../models/productDto";

export type OrderFilterData = {
  selectStatus: StatusDTO | null;
  selectProduct: ProductDTO | null;
};

type Props = {
  onSubmitFilter : (data: OrderFilterData) => void;
}

export default function OrderFilter( {onSubmitFilter} : Props ) {

  const [selectStatus, setSelectStatus] = useState<StatusDTO[]>([]);
  const [selectProduct, setSelectProduct] = useState<ProductDTO[]>([]);

  const { handleSubmit, control } = useForm<OrderFilterData>();

  const onSubmit = (filterData: OrderFilterData) => {
    //console.log("ENVIOU", filterData);
    onSubmitFilter(filterData)
  };

  useEffect(() => {
    requestBackend({ url: "/products" }).then((response) => {
      setSelectProduct(response.data.content);
    });
  }, []);

  useEffect(() => {
    requestBackend({ url: "/status" }).then((response) => {
      setSelectStatus(response.data.content);
    });
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="proj-filter-form">
          <div>
            <Controller
              name="selectProduct"
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  options={selectProduct}
                  classNamePrefix="proj-filter-form-product"
                  placeholder="Produto"
                  isClearable
                  getOptionLabel={(select: ProductDTO) => select.name}
                  getOptionValue={(select: ProductDTO) => String(select.id)}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="selectStatus"
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  options={selectStatus}
                  classNamePrefix="proj-filter-form-status"
                  placeholder="Status"
                  isClearable
                  getOptionLabel={(select: StatusDTO) => select.name}
                  getOptionValue={(select: StatusDTO) => String(select.id)}
                />
              )}
            />
          </div>
          <div>
            <button className="proj-filter-form-btn" >
              <img src={searchIcon} alt="Editar" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
