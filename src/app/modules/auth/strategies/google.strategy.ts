import { PassportStrategy } from "@nestjs/passport"; import { from } from "rxjs";
import { GoogleCallbackParameters, Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/redirect",
      scope: ['*'],
    })
  }

  async validate(_, __, profile) {
    return profile;
  }
}
