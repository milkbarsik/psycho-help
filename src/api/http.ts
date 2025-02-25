import axios from 'axios';

// const getToken = () => {
//   return sessionStorage.getItem('token') || localStorage.getItem('token');
// };

export const $serviceClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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