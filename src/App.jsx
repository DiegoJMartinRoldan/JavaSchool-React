import React from 'react';
import Context from './pages/authentication/customHooks/Auth';
import useAuth from './pages/authentication/customHooks/useAuth';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductList from './pages/users/catalog/ProductList';
import UserRegister from './pages/authentication/Register';
import Login from './pages/authentication/Login';
import AddAddress from './pages/users/clientsAddress/AddAddress';
import ShoppingCart from './pages/users/checkout/ShoppingCart';
import Reorder from './pages/users/profile/Reorder';
import SingleProductInfo from './pages/users/catalog/SingleProductInfo';
import ProtectedRoute from './pages/authentication/ProtectedRoute';
import AddProduct from './pages/employees/AddProduct';
import Unauthorized from './pages/authentication/Unauthorized';
import Statistics from './pages/employees/Statistics';
import PasswordChange from './pages/users/profile/PasswordChange';
import UserInformationChange from './pages/users/profile/UserInformationChange';
import UserProfile from './pages/users/profile/UserProfile';
import Products from './pages/employees/Products';
import OrderHistoryEmployees from './pages/employees/OrderHistoryEmployees';
import DeleteProduct from './pages/employees/DeleteProduct';
import UpdateProduct from './pages/employees/UpdateProduct';
import AddCategory from './pages/employees/AddCategory';
import AddToCart from './pages/users/checkout/AddToCart';
import './App.css';
import CheckoutForm from './pages/users/checkout/CheckoutForm';


export function App() {

  // To load authentication when the browser is closed and reopened
  const { updateAuth } = useAuth(Context);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');

    if (accessToken && refreshToken) {
      updateAuth({ email, accessToken, refreshToken, id, role });
    }
  }, []);

  return (
    <Layout >
      <Routes>
        <Route path='/' element={<Home></Home>} />
        <Route path="/catalog" element={<ProductList />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shoppingCart" element={<ShoppingCart />} />
        <Route path="/singleProductInfo/:id" element={<SingleProductInfo />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/clientAddress" element={<AddAddress />} />
        <Route path="/addToCart" element={<AddToCart />} />

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
          path='/passwordChange'
          element={
            <ProtectedRoute
              element={<PasswordChange />}
              role={["ROLE_USER"]}
            />
          }
        />
        <Route
          path='/reorder/:id'
          element={
            <ProtectedRoute
              element={<Reorder />}
              role={["ROLE_USER"]}
            />
          }
        />

        <Route
          path='/checkout'
          element={
            <ProtectedRoute
              element={<CheckoutForm/>}
              role={["ROLE_USER"]}
            />
          }
        />



        {/* ROLE_ADMIN */}

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
          path="/statistics"
          element={
            <ProtectedRoute
              element={<Statistics />}
              role={["ROLE_ADMIN"]}
            />
          }
        />

        <Route
          path="/adminProducts"
          element={
            <ProtectedRoute
              element={<Products />}
              role={["ROLE_ADMIN"]}
            />
          }
        />

        <Route
          path="/adminOrderHistory"
          element={
            <ProtectedRoute
              element={<OrderHistoryEmployees />}
              role={["ROLE_ADMIN"]}
            />
          }
        />

        <Route
          path="/deleteProduct"
          element={
            <ProtectedRoute
              element={<DeleteProduct />}
              role={["ROLE_ADMIN"]}
            />
          }
        />

        <Route
          path="/updateProduct"
          element={
            <ProtectedRoute
              element={<UpdateProduct />}
              role={["ROLE_ADMIN"]}
            />
          }
        />

        <Route
          path="/addCategory"
          element={
            <ProtectedRoute
              element={<AddCategory />}
              role={["ROLE_ADMIN"]}
            />
          }
        />




      </Routes>
    </Layout>
  );
}

export default App;
