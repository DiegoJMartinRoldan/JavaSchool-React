import React, { useState, createContext } from 'react';
import { useEffect } from 'react';

//App Context
const Context = createContext({});



//Provider
export const Auth = ({ children }) => {

    const initialCartState = {
        isSidebarOpen: false,
        recentlyAddedProduct: null,
    };
    // When you leave the app but you are already authenticated, the values must be recovered when you access the website again
    const initialAuthState = {
        id: localStorage.getItem('id'),
        accessToken: localStorage.getItem('accessToken'),
        token: localStorage.getItem('refreshToken')
    };
    const [cart, setCart] = useState(initialCartState);

    const [auth, setAuth] = useState(initialAuthState);

    const [user, setUser] = useState(null);



 

    const [isUserUpdated, setIsUserUpdated] = useState(false);

  



    //Auth Update
    const updateAuth = (updatedAuth) => {
        setAuth(prevAuth => ({
            ...prevAuth,
            ...updatedAuth
        }));
    };


    //Token Update
    const updateToken = (newToken) => {
        setAuth((prevAuth) => ({
            ...prevAuth,
            token: newToken,
        }));
    };

    //Logout
    const logout = () => {
        setAuth({
            id: null,
            accessToken: null,
            token: null,
        });
        localStorage.clear();
    };

    //User Update
    const updateUser = (updatedUser) => {
        console.log("Updating user:", updatedUser);
        setUser(prevUser => ({
            ...prevUser,
            ...updatedUser
        }));
        setIsUserUpdated(true); 
      };

    //Cart



    const updateCart = (updatedCart) => {
        setCart((prevCart) => ({
          ...prevCart,
          ...updatedCart,
        }));
      };


   

    return (
        <Context.Provider
            value={{ auth, updateAuth, updateToken, logout, user, updateUser, cart, updateCart }}
        >
            {children}
        </Context.Provider>
    );
};

export default Context;
export const CartContext = createContext();