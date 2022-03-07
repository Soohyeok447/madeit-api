import { payload } from '../use-cases/auth/common/oauth-abstract-factory/OAuth';

export abstract class GoogleAuthProvider {
  abstract getPayload(token: string): Promise<payload>;
}
