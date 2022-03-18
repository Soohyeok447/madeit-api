import { Injectable } from '@nestjs/common';
import { UserNotAdminException } from './exceptions/UserNotAdminException';
import { UserModel } from '../../../models/UserModel';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';

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

  static validateUsername(username: string): boolean {
    if (!username.length) return false;

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

    if (byte > 16 || byte < 2) return false;

    return true;
  }
}
