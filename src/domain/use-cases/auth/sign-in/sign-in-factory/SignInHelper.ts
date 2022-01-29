import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../../models/UserModel';
import { SignInResponseDto } from '../dtos/SignInResponseDto';

export abstract class SignInHelper {
  abstract verifyToken(token: string): Promise<userId>;

  abstract createOrFindUserByExistence(userId: string): Promise<UserModel>;

  abstract issueToken(user: UserModel): Promise<SignInResponseDto>;
}

export type userId = string;