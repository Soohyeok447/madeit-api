import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { AuthServiceImpl } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { UserRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { AuthService } from './interfaces/auth.service';
import { GoogleOauthInput } from './dto/google_oauth.dto';

const mockJwtService = {
  sign: jest.fn(),
};

const mockUserRepository = {
  findOneByEmail: jest.fn(),
  findOne: jest.fn(),
  updateRefreshToken: jest.fn(),
};

const spyCompare = jest.spyOn(bcrypt, "compare");

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
            issuer: 'futurekitschlab'
          }
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
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', async () => {
    expect(authService).toBeDefined();
  });

  //signOut하고 나서 update.status 값이 success를 반환하면 성공
  it('should return success', async () => {
    mockUserRepository.findOne.mockResolvedValue({ id: 'test', email: 'test@test.com', username: 'test' });
    mockUserRepository.updateRefreshToken.mockResolvedValue({ affected: 1 });

    const result = await authService.signOut('an id');

    expect(result).toBe(undefined);
  })

  //req.header로 받은 refreshToken과 유저DB에 저장돼있는
  //해싱된 refreshToken값을 비교해서 일치하면
  //accessToken 재발급
  it('should reissue accessToken', async () => {
    const refreshTokenIncludedInHeader = 'refreshToken';
    const userId = 1;

    mockUserRepository.findOne.mockResolvedValue({ id: 'test', email: 'test@test.com', username: 'test' });

    //compare 결과
    spyCompare.mockImplementation(() => true);

    //accesToken 재발급
    const result = await authService.reissueAccessToken(refreshTokenIncludedInHeader, userId);

    expect(result).toBeDefined();
    expect(result.accessToken).toBe('abc.abc.abc');
  })

});
