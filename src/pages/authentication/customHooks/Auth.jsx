import React, { useState, createContext } from 'react';
import { useEffect } from 'react';

//App Context
const Context = createContext({});


//Provider
export const Auth = ({ children }) => {

    // When you leave the app but you are already authenticated, the values must be recovered when you access the website again
    const initialAuthState = {
        id: localStorage.getItem('id'),
        accessToken: localStorage.getItem('accessToken'),
        token: localStorage.getItem('refreshToken')
    };

    const [auth, setAuth] = useState(initialAuthState);


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

      




    return (
        <Context.Provider value={{ auth, updateAuth, updateToken, logout }}>
            {children}
        </Context.Provider>
    );
};

export default Context;
