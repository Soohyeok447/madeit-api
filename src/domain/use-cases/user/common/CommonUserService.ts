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
}
