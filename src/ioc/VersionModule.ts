import { Module } from '@nestjs/common';
import { VersionControllerInjectedDecorator } from './controllers/version/VersionControllerInjectedDecorator';

@Module({
  imports: [],
  controllers: [VersionControllerInjectedDecorator],
  providers: [],
  exports: [],
})
export class VersionModule {}
