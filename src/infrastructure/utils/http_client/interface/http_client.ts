export abstract class HttpClient {
  abstract get(
    url: string,
    headers?: { [key: string]: string },
    params?: object,
  );

  abstract post(url: string, data: object, headers?: object);
}
