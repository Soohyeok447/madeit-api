import { Module } from '@nestjs/common';
import { UsersController } from '../adapter/controllers/users.controller';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { UsersServiceImpl } from 'src/domain/users/service/users.service';
import { UserRepository } from 'src/domain/common/repositories/user/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';
import { UsersService } from 'src/domain/users/service/interface/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
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
  ],
  exports: [
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
    },
  ],
})
export class UserModule {}
