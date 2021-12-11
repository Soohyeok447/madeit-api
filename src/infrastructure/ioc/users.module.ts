import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../../app/modules/users/interfaces/users.service';
import { UsersController } from '../../app/modules/users/users.controller';
import { UserRepository } from '../../app/modules/users/users.repository';
import { UsersServiceImpl } from '../../app/modules/users/users.service';

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
