import { Module } from '@nestjs/common';
import { VersionControllerInjectedDecorator } from './controllers/version/VideoControllerInjectedDecorator';

@Module({
  imports: [],
  controllers: [VersionControllerInjectedDecorator],
  providers: [],
  exports: [],
})
export class VersionModule {}
