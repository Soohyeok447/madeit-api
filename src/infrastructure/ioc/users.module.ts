import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../../adapter/services/users.service';
import { UsersController } from '../../adapter/controllers/users.controller';
import { UserRepository } from '../repositories/users.repository';
import { UsersServiceImpl } from 'src/domain/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
    }
  ],
  exports: [
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
    }
  ],
})
export class UserModule { }
