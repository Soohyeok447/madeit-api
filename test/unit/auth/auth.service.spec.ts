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

  //signOut하고 나서 update.status 값이 success를 반환하면 성공
  it('should return success', async () => {
    mockUserRepository.findOne.mockResolvedValue({
      id: 'test',
      email: 'test@test.com',
      username: 'test',
    });
    mockUserRepository.updateRefreshToken.mockResolvedValue({ affected: 1 });

    const result = await authService.signOut(3);

    expect(result).toBe(undefined);
  });

  //req.header로 받은 refreshToken과 유저DB에 저장돼있는
  //해싱된 refreshToken값을 비교해서 일치하면
  //accessToken 재발급
  it('should reissue accessToken', async () => {
    const refreshToken = 'refreshToken';
    const id = 1;

    mockUserRepository.findOne.mockResolvedValue({
      id: 'test',
      email: 'test@test.com',
      username: 'test',
    });
    mockJwtService.sign.mockReturnValue('abc.abc.abc');

    //compare 결과
    spyCompare.mockImplementation(() => true);

    //accesToken 재발급
    const result = await authService.reissueAccessToken({ refreshToken, id });

    expect(result).toBeDefined();
    expect(result.accessToken).toBe('abc.abc.abc');
  });

  it('should return accessToken, refreshToken', async () => {
    const desireResponse = {
      data: {
        email: 'test@email.com',
        verified_email: true,
        expires_in: 4141,
      },
    };

    spyGet.mockResolvedValue(desireResponse);

    mockUserRepository.findOneByEmail.mockResolvedValue({
      email: 'email',
      id: 1,
    });

    const result = await authService.googleAuth({
      googleAccessToken: 'coolToken',
    });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should throw exception if user not found', async () => {
    const desireResponse = {
      data: {
        email: 'test@email.com',
        verified_email: true,
        expires_in: 4141,
      },
    };

    spyGet.mockResolvedValue(desireResponse);

    mockUserRepository.findOneByEmail.mockResolvedValue(undefined);

    expect(
      authService.googleAuth({ googleAccessToken: 'coolToken' }),
    ).rejects.toThrow(UserNotFoundException);
  });

  it('should throw exception if invalid token', async () => {
    const desireResponse = {
      response: {
        data: {
          error: 'invalid_token',
        },
      },
    };

    spyGet.mockRejectedValue(desireResponse);

    expect(
      authService.googleAuth({ googleAccessToken: 'coolToken' }),
    ).rejects.toThrow(InvalidTokenException);
  });

  it('should throw exception if email is not verified', async () => {
    const desireResponse = {
      data: {
        email: 'test@email.com',
        verified_email: false,
        expires_in: 4141,
      },
    };

    spyGet.mockResolvedValue(desireResponse);

    expect(
      authService.googleAuth({ googleAccessToken: 'coolToken' }),
    ).rejects.toThrow(GoogleEmailNotVerifiedException);
  });

  it('should throw exception if request timeout', async () => {
    const desireResponse = {
      response: {
        status: 408,
      },
    };

    spyGet.mockRejectedValue(desireResponse);

    expect(
      authService.googleAuth({ googleAccessToken: 'coolToken' }),
    ).rejects.toThrow(RequestTimeoutException);
  });
});
