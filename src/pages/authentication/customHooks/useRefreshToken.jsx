import axios from 'axios';
import { useContext } from 'react';
import Context from './Auth';
import { useNavigate } from 'react-router-dom';


const useRefreshToken = () => {
    const { auth, updateAuth} = useContext(Context);




    //Api call -  Refresh Token method
    const refresh = async () => {
        try {
            const endpoint = 'http://localhost:8080/client/refreshToken';

            const refreshToken = {
                token: auth.token
            }
            const response = await axios.post(endpoint, refreshToken);
            //console.log('Refresh Token Request Response:', response.data);
            //console.log(response.data.token);  

            //Update "updateAuth" with new accessToken/token
            updateAuth((prev) => {
                //console.log('Previous Auth:', prev);
                return {
                    ...prev,
                    accessToken: response.data.accessToken,
                    token: response.data.token,
                };
            });

            return response.data.accessToken;
        } catch (error) {
            console.error('Error while refreshing token:', error);

            
            throw error;
        }
        
    };

    return refresh;
};

export default useRefreshToken;
