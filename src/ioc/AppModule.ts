import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './AuthModule';
import { UserModule } from './UserModule';
import { HttpModule } from '@nestjs/axios';
import { CartModule } from './CartModule';
import { OrderHistoryModule } from './OrderHistoryModule';
import { RoutineModule } from './RoutineModule';
import { VideoModule } from './VideoModule';
import { RecommendedRoutineModule } from './RecommendedRoutineModule';
import { VersionModule } from './VersionModule';
import { AppControllerInjectedDecorator } from './controllers/app/AppControllerInjectedDecorator';
import { InformationBoardModule } from './InformationBoardModule';
import { RepositoryModule } from './RepositoryModule';
import { ProviderModule } from './ProviderModule';
import { CoreModule } from './CoreModule';
import { LoggerModule } from './LoggerModule';
import { ExchangeModule } from './ExchangeModule';
import { PointHistoryModule } from './PointHistoryModule';
import { AdminModule } from './AdminModule';
import { ImageModule } from './ImageModule';
import { BannerModule } from './BannerModule';

@Module({
  imports: [
    CoreModule,
    LoggerModule.forRoot(),
    VersionModule,
    UserModule,
    AuthModule,
    CartModule,
    OrderHistoryModule,
    RoutineModule,
    HttpModule,
    TerminusModule,
    VideoModule,
    RecommendedRoutineModule,
    InformationBoardModule,
    RepositoryModule,
    ProviderModule,
    ExchangeModule,
    PointHistoryModule,
    AdminModule,
    ImageModule,
    BannerModule,
  ],
  controllers: [AppControllerInjectedDecorator],
  providers: [],
})
export class AppModule {}
