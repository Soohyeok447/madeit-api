import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { HttpClient } from 'src/domain/repositories/network/network';

export class HttpClientImpl implements HttpClient {
  async get(url: string, headers?: { [key: string] : string }, params?: object) {
    const axiosConfig: AxiosRequestConfig = { headers, params };
    return await axios.get(url, axiosConfig);
  }
  async post(url: string, data: object, headers?: { [key: string] : string }) {
    return await axios.post(url, data, headers);
  }
}
