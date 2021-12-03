import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './interfaces/users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { UsersServiceImpl } from './users.service';

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
