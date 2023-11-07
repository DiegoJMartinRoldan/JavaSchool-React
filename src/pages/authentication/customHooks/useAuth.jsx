import { useContext } from 'react';
import Context from './Auth';


//We avoid importing the context and the use of the context in each component with this hook
const useAuth = () => {

  return (
    useContext(Context)
  )
}
export default useAuth;