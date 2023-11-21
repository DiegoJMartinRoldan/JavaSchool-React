import customAxios from "./customAxios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useCustomAxios = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {

        //Auth interceptor
        const reqInterceptor = customAxios.interceptors.request.use(
            config => {
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
                if (error?.response?.status === 403 && !previousRequest?.sent) {
                    previousRequest.sent = true;
                    const newAccessToken = await refresh();
                    if (!newAccessToken) {
                        navigate('/login')
                    } else {
                        previousRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return customAxios(previousRequest);
                    }
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