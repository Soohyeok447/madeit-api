export type payload = {
  id?: string;
  appId?: string;
  email_verified?: boolean;
  azp?: string;
  sub?: string;
};

export abstract class OAuth {
  abstract verifyToken(): Promise<payload>;

  abstract getUserIdByPayload(payload: payload): Promise<string>;
}
