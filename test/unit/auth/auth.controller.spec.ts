import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthController } from 'src/adapter/controllers/auth.controller';
import { AuthService } from 'src/domain/services/interfaces/auth.service';

const mockAuthService = {
  signIn: jest.fn(),
  signOut: jest.fn(),
  reissueAccessToken: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  const email = 'sample@sample.com';
  const password = 'password1';

  const authCredentialDto = {
    email,
    password,
  };

  it('should call fucntion successful with no exceptions', async () => {
    mockAuthService.signOut.mockResolvedValue({
      message: 'succeed to update refreshToken to null',
      status: 'success',
    });

    const result = await authController.signOut(authCredentialDto);

    expect(result).toBe(undefined);
  });

  it('should return accessToken', async () => {
    mockAuthService.reissueAccessToken.mockResolvedValue({
      accessToken: 'accessToken',
    });

    const result = await authController.reissueAccessToken(
      { authorization: 'bearer refreshToken' },
      'userid',
    );

    expect(result.accessToken).toBeDefined();
  });
});
