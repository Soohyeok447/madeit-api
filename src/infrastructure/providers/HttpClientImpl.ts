import axios, { AxiosRequestConfig } from 'axios';
import { HttpClient } from '../../domain/providers/HttpClient';

export class HttpClientImpl implements HttpClient {
  public async get(
    url: string,
    headers?: { [key: string]: string },
    params?: object,
  ) {
    const axiosConfig: AxiosRequestConfig = { headers, params };
    return await axios.get(url, axiosConfig);
  }

  public async post(
    url: string,
    data: object,
    headers?: { [key: string]: string },
  ) {
    return await axios.post(url, data, headers);
  }
}
