import axios, { AxiosRequestConfig } from 'axios';
import { HttpClient, HttpResponse } from '../../domain/providers/HttpClient';

export class HttpClientImpl implements HttpClient {
  public async get(
    url: string,
    headers?: Record<string, string>,
    params?: object,
  ): Promise<HttpResponse> {
    const axiosConfig: AxiosRequestConfig = { headers, params };
    return await axios.get(url, axiosConfig);
  }

  public async post(
    url: string,
    data: object,
    headers?: Record<string, string>,
  ): Promise<HttpResponse> {
    return await axios.post(url, data, headers);
  }
}
