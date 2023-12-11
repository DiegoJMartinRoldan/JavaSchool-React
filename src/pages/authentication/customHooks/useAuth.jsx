import { useContext } from 'react';
import Context from './Auth';

// We avoid importing the context and the use of the context in each component with this hook
const useAuth = () => {
  const { auth, updateAuth, logout, user, updateUser, cart, updateCart, updateTrigger, triggerUpdate} = useContext(Context);

  // Use the updateAuth function to update the auth context
  return { auth, updateAuth, logout, user, updateUser , cart, updateCart, updateTrigger, triggerUpdate  };
  
};

export default useAuth;
