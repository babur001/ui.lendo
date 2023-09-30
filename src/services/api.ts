import axios from "axios";

export const baseUrl = `https://mp-api.techstack.uz/mp-client-api`;
export const clientApi = `https://mp-api.techstack.uz/mp-client-api`;

export const req = axios.create({
  baseURL: clientApi,
  timeout: 5000,
});

req.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
