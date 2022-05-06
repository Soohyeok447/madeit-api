import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminRefreshStrategy } from '../adapter/common/strategies/AdminRefreshStrategy';
import { AdminStrategy } from '../adapter/common/strategies/AdminStrategy';
import { ExchangeStrategy } from '../adapter/common/strategies/ExchangeStrategry';
import { JwtRefreshStrategy } from '../adapter/common/strategies/JwtRefreshStrategy';
import { JwtStrategy } from '../adapter/common/strategies/JwtStrategy';
import { AdminAuthProvider } from '../domain/providers/AdminAuthProvider';
import { EmailProvider } from '../domain/providers/EmailProvider';
import { ExchangeAuthProvider } from '../domain/providers/ExchangeAuthProvider';
import { GoogleAnalyticsProvider } from '../domain/providers/GoogleAnalyticsProvider';
import { HashProvider } from '../domain/providers/HashProvider';
import { HttpClient } from '../domain/providers/HttpClient';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { MomentProvider } from '../domain/providers/MomentProvider';
import { UserUtils } from '../domain/use-cases/user/common/UserUtils';
import { AdminAuthProviderImpl } from '../infrastructure/providers/AdminAuthProviderImpl';
import { EmailProviderImpl } from '../infrastructure/providers/EmailProviderImpl';
import { ExchangeAuthProviderImpl } from '../infrastructure/providers/ExchangeAuthProviderImpl';
import { GoogleAnalyticsProviderImpl } from '../infrastructure/providers/GoogleAnalyticsProviderImpl';
import { HashProviderImpl } from '../infrastructure/providers/HashProviderImpl';
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
    {
      provide: AdminAuthProvider,
      useClass: AdminAuthProviderImpl,
    },
    {
      provide: HashProvider,
      useClass: HashProviderImpl,
    },
    {
      provide: GoogleAnalyticsProvider,
      useClass: GoogleAnalyticsProviderImpl,
    },
    JwtStrategy,
    JwtRefreshStrategy,
    AdminStrategy,
    AdminRefreshStrategy,
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
    {
      provide: AdminAuthProvider,
      useClass: AdminAuthProviderImpl,
    },
    {
      provide: HashProvider,
      useClass: HashProviderImpl,
    },
    {
      provide: GoogleAnalyticsProvider,
      useClass: GoogleAnalyticsProviderImpl,
    },
    JwtStrategy,
    JwtRefreshStrategy,
    ExchangeStrategy,
    AdminStrategy,
    AdminRefreshStrategy,
    PassportModule,
  ],
})
export class ProviderModule {}
