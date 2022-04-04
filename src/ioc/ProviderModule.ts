import { Global, Module } from '@nestjs/common';
import { HttpClient } from '../domain/providers/HttpClient';
import { ImageProvider } from '../domain/providers/ImageProvider';
import { MomentProvider } from '../domain/providers/MomentProvider';
import { UserUtils } from '../domain/use-cases/user/common/UserUtils';
import { HttpClientImpl } from '../infrastructure/providers/HttpClientImpl';
import { ImageProviderImpl } from '../infrastructure/providers/ImageProviderImpl';
import { MomentProviderImpl } from '../infrastructure/providers/MomentProviderImpl';

@Global()
@Module({
  imports: [],
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
  ],
})
export class ProviderModule {}
