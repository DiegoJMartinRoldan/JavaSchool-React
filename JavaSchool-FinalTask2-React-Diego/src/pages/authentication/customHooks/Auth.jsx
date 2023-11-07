import React, { useState, createContext } from "react";

//1. createContext from "react", empty by default
const Context = createContext({})

// Through Auth we provide the entire application with the context and the possibility of changing its state
export const Auth = ({children}) => {

    const [auth, setAuth] = useState({})

    return (

        <Context.Provider value={{auth, setAuth}}>
            {children}
        </Context.Provider>
    )
}

export default Context;

