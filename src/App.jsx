import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductList from './pages/users/catalog/ProductList';
import UserRegister from './pages/authentication/Register';
import Login from './pages/authentication/Login';
import AddAddress from './pages/users/clientsAddress/AddAddress';
import UserProfile from './pages/users/profile/UserProfile';
import PasswordChange from './pages/users/profile/PasswordChange';
import UserInformationChange from './pages/users/profile/UserInformationChange';
import ShoppingCart from './pages/users/checkout/ShoppingCart';
import Reorder from './pages/users/checkout/Reorder';
import SingleProductInfo from './pages/users/catalog/SingleProductInfo';
import ProtectedRoute from './pages/authentication/ProtectedRoute';
import AddProduct from './pages/employees/AddProduct';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<ProductList />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shoppingCart" element={<ShoppingCart />} />
        <Route path="/singleProductInfo/:id" element={<SingleProductInfo />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/passwordChange" element={<PasswordChange />} />
        <Route path="/userInformationChange" element={<UserInformationChange />} />
        <Route path="/reorder" element={<Reorder />} />

        <Route
          path="/clientAddress"
          element={
            <ProtectedRoute
              element={<AddAddress />}
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

      </Routes>
    </Layout>
  );
}

export default App;
