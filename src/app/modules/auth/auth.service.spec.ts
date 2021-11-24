import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users/users.repository';

const mockJwtService = {
  sign: jest.fn(),
};

const mockUserService = {
 
}

const mockUserRepository ={
  findOneByEmail: jest.fn(),
  findOneById: jest.fn(),
  updateRefreshToken: jest.fn(),
};

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
            issuer: 'futurekitchlab'
          }
        }),
      ],
      providers: [
        JwtStrategy,
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
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

  //email이 일치하지 않아서 user가 리턴되지 않아 NotFoundException 호출
  it('should throw NotFoundException', async () => {
    const wrongEmailAuthCredentialDto = {
      email: 'wrongEmail@email.com',
      password: 'validPassword',
    };

    mockUserRepository.findOneByEmail.mockResolvedValue(undefined);

    expect(authService.signIn(wrongEmailAuthCredentialDto)).rejects.toThrow(NotFoundException);
  });

  //잘못된 비밀번호 입력 UnauthorizedException 호출
  it('should throw UnauthorizedException', async () => {
    const wrongPasswordAuthCredentialDto = {
      email: 'validEmail@email.com',
      password: 'wrongPassword',
    };

    mockUserRepository.findOneByEmail.mockResolvedValue({
      email: 'validEmail@email.com',
      password: 'existPassword',
      username: 'passwordtest'
    });

    expect(authService.signIn(wrongPasswordAuthCredentialDto)).rejects.toThrow(UnauthorizedException);
  });

  //accessToken이랑 refreshToken생성 됐나 테스트
  it('should return JSON object included accessToken and refreshToken', async () => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('existPassword', salt);

    const authCredentialDto = {
      email: 'validEmail@email.com',
      password: 'existPassword',
    };

    mockUserRepository.findOneByEmail.mockResolvedValue({
      email: 'validEmail@email.com',
      password: hashedPassword,
      username: 'passwordtest'
    });

    mockUserRepository.updateRefreshToken.mockResolvedValue(null);


    mockJwtService.sign.mockReturnValue('abc.abc.abc');

    const result = await authService.signIn(authCredentialDto);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();

  })

  //signOut하고 나서 update.status 값이 success를 반환하면 성공
  it('should return success', async () => {
    mockUserRepository.findOneById.mockResolvedValue({id:'test',email:'test@test.com',username:'test'});
    mockUserRepository.updateRefreshToken.mockResolvedValue({affected:1});

    const result = await authService.signOut('an id');

    expect(result.status).toBe('success');
  })

});
