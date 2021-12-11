import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { HttpClient } from 'src/domain/repositories/network/network';

export class HttpClientImpl implements HttpClient {
  async get(url: string, headers?: AxiosRequestHeaders, params?: object) {
    const axiosConfig: AxiosRequestConfig = { headers, params };
    return await axios.get(url, axiosConfig);
  }
  async post(url: string, data: object, headers?: object) {
    return await axios.post(url, data, headers);
  }
}
