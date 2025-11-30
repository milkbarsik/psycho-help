import axios from 'axios';

// const getToken = () => {
//   return sessionStorage.getItem('token') || localStorage.getItem('token');
// };

export const $serviceClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
  withCredentials: true,
});

$serviceClient.interceptors.request.use(async (config) => {
  // const loginToken = getToken();

  // if (loginToken) {
  //   document.cookie = `access_token=${loginToken}; path=/`;
  // }

  // console.log(document.cookie);
  return config;
});

export const $api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
  withCredentials: true,
});

$api.interceptors.request.use(async (config) => {
  // const loginToken = getToken();

  // if (loginToken) {
  //   document.cookie = `access_token=${loginToken}; path=/`;
  // }

  // console.log(document.cookie);
  return config;
});
