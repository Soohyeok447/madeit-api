import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthController } from 'src/adapter/controllers/AuthController';
import { AuthService } from 'src/domain/auth/service/interface/auth.service';

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
