export abstract class HttpClient {
  abstract get(url: string, headers?:object, params?:object);

  abstract post(url: string, data: object, headers?:object);
}