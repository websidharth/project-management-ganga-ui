import { injectable } from 'inversify';

import axios, { AxiosError, AxiosInstance } from 'axios';
import config from '@/config';
import IHttpService from './interfaces/IHttpService';

@injectable()
export default class HttpService implements IHttpService {
  private readonly baseUrl: string;
  private readonly clientId: string;
  constructor() {
    this.baseUrl = config.apiBaseUrl;
    this.clientId = config.clientId;
  }

  externalCall(contentType: string = 'application/json'): AxiosInstance {
    return axios.create({
      headers: {
        'Content-Type': contentType,
      },
      validateStatus: (status) => {
        return status < 500; // Resolve only if the status code is less than 500
      },
    });
  }

  call(contentType: string = 'application/json'): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: false,
      headers: {
        clientId: this.clientId,
        'Content-Type': contentType,
      },
      validateStatus: (status) => {
        return status < 500; // Resolve only if the status code is less than 500
      },
    });

    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('at');
      if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }

    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            /*
              ?401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
            */
            //todo *call logout*
          } else if (error.response?.status === 403) {

            //todo *redirect to /access-denied*
            /*
             ?403 Forbidden is the status code to return when a client has valid credentials but not enough 
             ?privileges to perform an action on a resource 
            */
            //todo *call access-denied page*
          }

          const statusCode: number = error.response?.status || 0;
          if (statusCode >= 400 && statusCode < 500) {
            return error;
          }
        }

        //todo - Handle global error

        return Promise.reject(error);
      }
    );
    return instance;
  }
}
