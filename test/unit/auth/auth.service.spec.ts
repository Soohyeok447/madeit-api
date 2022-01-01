import {
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { AuthServiceImpl } from '../../../src/domain/services/auth.service';

import { UserRepositoryImpl } from '../../../src/infrastructure/repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../../src/domain/services/interfaces/auth.service';
import axios from 'axios';
import { UserNotFoundException } from 'src/domain/exceptions/users/user_not_found.exception';
import { InvalidTokenException } from 'src/domain/exceptions/auth/invalid_token.exception';
import { GoogleEmailNotVerifiedException } from 'src/domain/exceptions/auth/google/google_email_not_verified.exception';
import { JwtStrategy } from 'src/adapter/common/strategies/jwt.strategy';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { HttpClient } from 'src/infrastructure/utils/http_client/interface/http_client';
import { HttpClientImpl } from 'src/infrastructure/utils/http_client/http_client';

const mockJwtService = {
  sign: jest.fn(),
};

const mockUserRepository = {
  findOneByEmail: jest.fn(),
  findOne: jest.fn(),
  updateRefreshToken: jest.fn(),
};

const spyCompare = jest.spyOn(bcrypt, 'compare');

//need to refactoring to using http client interface
const spyGet = jest.spyOn(axios, 'get');

describe('AuthService', () => {
  let authService: AuthService; //authService를 테스트

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: 'a secret',
          signOptions: {
            expiresIn: 1800,
            issuer: 'futurekitschlab',
          },
        }),
      ],
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useClass: AuthServiceImpl,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: HttpClient,
          useClass: HttpClientImpl,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', async () => {
    expect(authService).toBeDefined();
  });

  describe('singOut()', () => {
    it('should throw UserNotFoundException', async () => {
      const id = 'id';

      mockUserRepository.findOne.mockResolvedValue(undefined);

      expect(authService.signOut(id)).rejects.toThrow(UserNotFoundException);
    });

    it('should return nothing', async () => {
      const id = 'id';

      mockUserRepository.findOne.mockResolvedValue('user object');

      expect(await authService.signOut(id)).toBe(undefined);
    });
  });
});
