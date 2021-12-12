import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../adapter/controllers/users.controller';
import { UserRepositoryImpl } from '../infrastructure/repositories/database/users.repository';
import { UsersServiceImpl } from 'src/domain/services/users.service';
import { UserRepository } from 'src/domain/repositories/database/users.repository';
import { User } from '../infrastructure/entities/user.entity';
import { UsersService } from 'src/domain/services/interfaces/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    UserRepositoryImpl,
  ],
  exports: [
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
    },
  ],
})
export class UserModule {}
