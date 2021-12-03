import { PickType } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";

export class AuthCredentialInput extends PickType(
  User,
  [
    'email',
    'password'
  ]) { }

export class AuthCredentialOutput {
  accessToken: string;

  refreshToken: string;
}
