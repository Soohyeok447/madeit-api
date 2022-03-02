import { OAuth2Client } from "google-auth-library";

export abstract class GoogleAuthProvider {
  abstract getGoogleClient(googleClientId: string): OAuth2Client ;
}
