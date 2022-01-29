import { Injectable } from '@nestjs/common';
import { AuthService } from './interface/AuthService';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor() {}
}
