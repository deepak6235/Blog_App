import axios from "axios";
import { loadingBus } from "./loadingBus";

let interceptorsInstalled = false;

export function installAxiosLoadingInterceptors() {
  if (interceptorsInstalled) return;
  interceptorsInstalled = true;

  axios.interceptors.request.use(
    (config) => {
      // Skip opt-out requests
      if (!config.__skipGlobalLoading) {
        loadingBus.incNetwork();
      }
      return config;
    },
    (error) => {
      loadingBus.decNetwork();
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      if (!response.config.__skipGlobalLoading) {
        loadingBus.decNetwork();
      }
      return response;
    },
    (error) => {
      // Ensure we decrement even on errors
      const cfg = error?.config || {};
      if (!cfg.__skipGlobalLoading) {
        loadingBus.decNetwork();
      }
      return Promise.reject(error);
    }
  );
}


