import axios from 'axios';
// import Storage, { S_LAST_LOGIN_TOKEN } from "../../services/storage-service";

export const $serviceClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

$serviceClient.interceptors.request.use(async (config) => {
	// const loginToken = Storage.getItem(S_LAST_LOGIN_TOKEN);
  const loginToken = localStorage.getItem('token');

  if (loginToken) {
    config.headers.Authorization = `Bearer ${loginToken}`;
  }

  return config;
});
