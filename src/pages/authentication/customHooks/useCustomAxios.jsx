import customAxios from "./customAxios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useCustomAxios = () => {
    const refresh = useRefreshToken();
    const {auth}= useAuth();


    useEffect(() => {

        //Auth interceptor
        const reqInterceptor = customAxios.interceptors.request.use(
            config =>  {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );
        
        //Status errors like '403'
        const respInterceptor = customAxios.interceptors.response.use(
            response => response,
            async (error) => {
                const previousRequest = error?.config;
                if(error?.response?.status === 403 && !previousRequest?.sent){
                    previousRequest.sent = true;
                    const newAccessToken = await refresh();
                    //console.log('New Token:', newAccessToken); 
                    previousRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return customAxios(previousRequest);
                }

                return Promise.reject(error);
            }
        );
        return () => {
            customAxios.interceptors.request.eject(reqInterceptor);
            customAxios.interceptors.response.eject(respInterceptor);
        }


    }, [auth, refresh])

    return customAxios;
}

export default useCustomAxios;