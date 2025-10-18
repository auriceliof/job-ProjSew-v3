import { Navigate, Route, Routes } from 'react-router-dom';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { history } from './utils/history';

import Header from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';

import ListingSupplier from './pages/Supplier/ListingSupplier';
import FormSupplier from './pages/Supplier/FormSupplier';

import ListingProduct from './pages/Product/ListingProduct';
import FormProduct from './pages/Product/FormProduct';
import ListingSubProduct from './pages/Product/SubProduct/ListingSubProduct';
import FormSubProduct from './pages/Product/SubProduct/FormSubProduct';

import ListingOrder from './pages/Order/ListingOrder';
import FormOrderStep from './pages/Order/FormOrderStep';
import ListingOrderPay from './pages/Order/ListingOrderPay';

import ListingPay from './pages/Order/Pay/ListingPay';
import FormPay from './pages/Order/Pay/FormPay';
import { ToastContainer } from 'react-toastify';
import ListingUser from './pages/User/ListingUser';
import FormUser from './pages/User/FormUser';

function App() {
  return (
    <>
      <HistoryRouter history={history}>
      
        <Header />

        <Routes>
          
          <Route path="login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route index element={<Home />} />
            <Route path="listingSuppliers" element={<ListingSupplier />} />
            <Route path="listingSuppliers/:supplierId" element={<FormSupplier />} />
            <Route path="listingProducts" element={<ListingProduct />} />
            <Route path="listingProducts/:productId" element={<FormProduct />} />
            <Route path="listingSubProducts" element={<ListingSubProduct />} />
            <Route path="listingSubProducts/:subProductId" element={<FormSubProduct />} />
            <Route path="listingOrders" element={<ListingOrder />} />
            <Route path="listingOrders/:orderId" element={<FormOrderStep />} />
            <Route path="listingOrdersPay" element={<ListingOrderPay />} />
            <Route path="listingOrdersPay/:orderPayId" element={<FormPay />} />
            <Route path="listingPay" element={<ListingPay />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>

          <Route element={<PrivateRoute roles={['ROLE_ADMIN']} />}>
            <Route path="listingOrders/create" element={<FormOrderStep />} />
            <Route path="listingPay/:payId" element={<FormPay />} />
            <Route path="listingUsers" element={<ListingUser />} />
            <Route path="listingUsers/:userId" element={<FormUser />} />
          </Route>
        </Routes>
      </HistoryRouter>

      <ToastContainer />
    </>

  );
}

export default App;
