import axios from "axios";

const baseUrl = "https://christmasapi.herokuapp.com/api/v1";
const requestClient = axios.create({
  baseURL: baseUrl,
  // cancelToken: source.token,
  headers: {},
  timeout: 50000,
});

//This is used to handle routes that require and do not require accessToken for authentication
requestClient.interceptors.request.use(
  (requestConfig) => {
    // Get the request route
    // @ts-ignore
    const requestRoute = requestConfig?.url?.substring(requestConfig?.baseURL);
    
    // If it's an excluded route, continue as normal by returning the original request config
    const EXCLUDED_ROUTES = ["/auth/login", "/messages/*"];
    const PROTECTED_ROUTES = ["/messages", "admin/carers/states"];

    if (EXCLUDED_ROUTES.includes(requestRoute as string)) {
      return requestConfig;
    }

      // @ts-ignore
      // Else, update the request to get the user token from the localstorage
      const user = JSON.parse(localStorage?.getItem('accessToken'));
      // @ts-ignore
      const accessToken = `Bearer ${user}`;
      const requestConfigWithToken = Object.assign({}, requestConfig);
      if (requestConfigWithToken?.headers) {
        requestConfigWithToken.headers["Authorization"] = accessToken;
      }
      return requestConfigWithToken;
  
  },
  (error) => Promise.reject(error)
);

export default requestClient;