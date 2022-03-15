import { Injectable } from '@nestjs/common';
import { UserNotAdminException } from './exceptions/UserNotAdminException';
import { UserModel } from '../../../models/UserModel';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { InvalidUsernameException } from '../validate-username/exceptions/InvalidUsernameException';
import { UsernameConflictException } from '../validate-username/exceptions/UsernameConflictException';

@Injectable()
export class CommonUserService {
  static validateAdmin(user: UserModel) {
    const isAdmin = user['is_admin'] ?? null;

    if (!isAdmin) {
      throw new UserNotAdminException();
    }
  }

  static assertUserExistence(user: UserModel) {
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  static validateUsername(
    username: string,
    assertUsernameDuplication?: UserModel,
  ) {
    const usernameSubstring: string[] = username.split('');

    const byte = usernameSubstring.reduce((acc, cur) => {
      const code = cur.charCodeAt(0);

      if (code > 127) {
        return (acc += 2);
      } else if (code > 64 && code < 91) {
        return (acc += 2);
      } else {
        return (acc += 1);
      }
    }, 0);

    if (byte > 16 || byte < 2) throw new InvalidUsernameException();

    if (assertUsernameDuplication) {
      throw new UsernameConflictException();
    }
  }
}
