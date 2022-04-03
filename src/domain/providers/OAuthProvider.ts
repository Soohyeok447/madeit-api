export interface payload {
  id?: string;
  appId?: string;
  email_verified?: boolean;
  azp?: string;
  sub?: string;
}

export abstract class OAuthProvider {
  public abstract getPayloadByToken(token: string): Promise<payload>;

  public abstract getUserIdByPayload(payload: payload): Promise<string>;
}
