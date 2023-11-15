import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductList from './pages/users/catalog/ProductList';
import UserRegister from './pages/authentication/Register';
import Login from './pages/authentication/Login';
import AddAddress from './pages/users/clientsAddress/AddAddress';
import ShoppingCart from './pages/users/checkout/ShoppingCart';
import Reorder from './pages/users/profile/orderHistory/Reorder';
import SingleProductInfo from './pages/users/catalog/SingleProductInfo';
import ProtectedRoute from './pages/authentication/ProtectedRoute';
import AddProduct from './pages/employees/AddProduct';
import Unauthorized from './pages/authentication/Unauthorized';

import OrderHistory from './pages/users/profile/orderHistory/OrderHistory';
import PasswordChange from './pages/users/profile/PasswordChange';
import UserInformationChange from './pages/users/profile/UserInformationChange';
import UserProfile from './pages/users/profile/UserProfile';
import UpdateAddress from './pages/users/clientsAddress/UpdateAddress';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home></Home>} />
        <Route path="/catalog" element={<ProductList />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shoppingCart" element={<ShoppingCart />} />
        <Route path="/singleProductInfo/:id" element={<SingleProductInfo />} />
        <Route path="/passwordChange" element={<PasswordChange />} />
        <Route path="/reorder/:id" element={<Reorder />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/updateAddress" element={<UpdateAddress />} />

        <Route path="/clientAddress" element={<AddAddress />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={<UserProfile />}
              role={["ROLE_USER"]}
            />
          }
        />

        <Route
          path="/userInformationChange/:id"
          element={
            <ProtectedRoute
              element={<UserInformationChange />}
              role={["ROLE_USER"]}
            />
          }
        />

        <Route
          path="/addProduct"
          element={
            <ProtectedRoute
              element={<AddProduct />}
              role={["ROLE_ADMIN"]}
            />
          }
        />

        <Route
          path="/orderHistory"
          element={
            <ProtectedRoute
              element={<OrderHistory />}
              role={["ROLE_USER", "ROLE_ADMIN"]}
            />
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
