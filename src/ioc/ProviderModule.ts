import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ExchangeStrategy } from '../adapter/common/strategies/ExchangeStrategry';
import { JwtRefreshStrategy } from '../adapter/common/strategies/JwtRefreshStrategy';
import { JwtStrategy } from '../adapter/common/strategies/JwtStrategy';
import { EmailProvider } from '../domain/providers/EmailProvider';
import { ExchangeAuthProvider } from '../domain/providers/ExchangeAuthProvider';
import { HttpClient } from '../domain/providers/HttpClient';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { MomentProvider } from '../domain/providers/MomentProvider';
import { UserUtils } from '../domain/use-cases/user/common/UserUtils';
import { EmailProviderImpl } from '../infrastructure/providers/EmailProviderImpl';
import { ExchangeAuthProviderImpl } from '../infrastructure/providers/ExchangeAuthProviderImpl';
import { HttpClientImpl } from '../infrastructure/providers/HttpClientImpl';
import { ImageProviderImpl } from '../infrastructure/providers/ImageProviderImpl';
import { MomentProviderImpl } from '../infrastructure/providers/MomentProviderImpl';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  providers: [
    UserUtils,
    {
      provide: HttpClient,
      useClass: HttpClientImpl,
    },
    {
      provide: ImageProvider,
      useClass: ImageProviderImpl,
    },
    {
      provide: MomentProvider,
      useClass: MomentProviderImpl,
    },
    {
      provide: EmailProvider,
      useClass: EmailProviderImpl,
    },
    {
      provide: ExchangeAuthProvider,
      useClass: ExchangeAuthProviderImpl,
    },
    JwtStrategy,
    JwtRefreshStrategy,
    ExchangeStrategy,
  ],
  exports: [
    UserUtils,
    {
      provide: HttpClient,
      useClass: HttpClientImpl,
    },
    {
      provide: ImageProvider,
      useClass: ImageProviderImpl,
    },
    {
      provide: MomentProvider,
      useClass: MomentProviderImpl,
    },
    {
      provide: EmailProvider,
      useClass: EmailProviderImpl,
    },
    {
      provide: ExchangeAuthProvider,
      useClass: ExchangeAuthProviderImpl,
    },
    JwtStrategy,
    JwtRefreshStrategy,
    ExchangeStrategy,
    PassportModule,
  ],
})
export class ProviderModule {}
