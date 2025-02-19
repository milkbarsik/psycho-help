import axios from 'axios';
// import Storage, { S_LAST_LOGIN_TOKEN } from "../../services/storage-service";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJxd2VAcXdlLnF3ZSIsImV4cCI6MTczOTk2NDE3MH0.AFsO6UPwmKW9Mc9gN8CvmbbC1CRWlK_eUEnWtDtAS3U"

export const $serviceClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
	withCredentials: true,
});

$serviceClient.interceptors.request.use(async (config) => {
	// const loginToken = Storage.getItem(S_LAST_LOGIN_TOKEN);
  // const loginToken = localStorage.getItem('token');

  // if (loginToken) {
  //   document.cookie = `access_token=${loginToken}; path=/; SameSite=None; Secure`;
  // }
	
	document.cookie = `access_token=${token}; path=/; SameSite=None; Secure`;
  return config;
});



