import { useContext } from 'react';
import Context from './Auth';

// We avoid importing the context and the use of the context in each component with this hook
const useAuth = () => {
  const { auth, updateAuth, logout} = useContext(Context);

  // Use the updateAuth function to update the auth context
  return { auth, updateAuth, logout };
};

export default useAuth;
