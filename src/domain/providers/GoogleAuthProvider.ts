export abstract class GoogleAuthProvider {
  abstract getGoogleClient(googleClientId: string);
}
