export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string> & {
    'set-cookie'?: string[];
  };
}

export abstract class HttpClient {
  public abstract get(
    url: string,
    headers?: { [key: string]: string },
    params?: object,
  ): Promise<HttpResponse>;

  public abstract post(
    url: string,
    data: object,
    headers?: object,
  ): Promise<HttpResponse>;
}
