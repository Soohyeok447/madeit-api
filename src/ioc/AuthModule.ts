import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from '../adapter/common/strategies/JwtStrategy';
// import { JwtRefreshStrategy } from '../adapter/common/strategies/JwtRefreshStrategy';
import { AuthControllerInjectedDecorator } from './controllers/auth/AuthControllerInjectedDecorator';
import { SignInUseCaseImpl } from '../domain/use-cases/auth/sign-in/SignInUseCaseImpl';
import { ReissueAccessTokenUseCase } from '../domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCase';
import { ReissueAccessTokenUseCaseImpl } from '../domain/use-cases/auth/reissue-access-token/ReissueAccessTokenUseCaseImpl';
import { SignInUseCase } from '../domain/use-cases/auth/sign-in/SignInUseCase';
import { SignOutUseCase } from '../domain/use-cases/auth/sign-out/SignOutUseCase';
import { SignOutUseCaseImpl } from '../domain/use-cases/auth/sign-out/SignOutUseCaseImpl';
import { WithdrawUseCase } from '../domain/use-cases/auth/withdraw/WithdrawUseCase';
import { WithdrawUseCaseImpl } from '../domain/use-cases/auth/withdraw/WithdrawUseCaseImpl';
import { OAuthProviderFactory } from '../domain/providers/OAuthProviderFactory';
import { OAuthFactoryImpl } from '../infrastructure/providers/oauth/OAuthFactoryImpl';
import { ValidateUseCase } from '../domain/use-cases/auth/validate/ValidateUseCase';
import { ValidateUseCaseImpl } from '../domain/use-cases/auth/validate/ValidateUseCaseImpl';
import { JwtProvider } from '../domain/providers/JwtProvider';
import { JwtProviderImpl } from '../infrastructure/providers/JwtProviderImpl';
import { SignUpUseCase } from '../domain/use-cases/auth/sign-up/SignUpUseCase';
import { HashProvider } from '../domain/providers/HashProvider';
import { HashProviderImpl } from '../infrastructure/providers/HashProviderImpl';
import { SignUpUseCaseImplV2 } from '../domain/use-cases/auth/sign-up/SignUpUseCaseImplV2';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register({}),
  ],
  controllers: [AuthControllerInjectedDecorator],
  providers: [
    {
      provide: SignInUseCase,
      useClass: SignInUseCaseImpl,
    },
    {
      provide: SignUpUseCase,
      useClass: SignUpUseCaseImplV2,
    },
    {
      provide: ReissueAccessTokenUseCase,
      useClass: ReissueAccessTokenUseCaseImpl,
    },
    {
      provide: SignOutUseCase,
      useClass: SignOutUseCaseImpl,
    },
    {
      provide: OAuthProviderFactory,
      useClass: OAuthFactoryImpl,
    },
    {
      provide: WithdrawUseCase,
      useClass: WithdrawUseCaseImpl,
    },
    {
      provide: ValidateUseCase,
      useClass: ValidateUseCaseImpl,
    },
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    {
      provide: HashProvider,
      useClass: HashProviderImpl,
    },
    // JwtStrategy,
    // JwtRefreshStrategy,
  ],
  // exports: [PassportModule, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
