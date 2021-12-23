import { Module } from '@nestjs/common';
import { UsersController } from '../adapter/controllers/users.controller';
import { UserRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { UsersServiceImpl } from 'src/domain/services/users.service';
import { UserRepository } from 'src/domain/repositories/users.repository';
import { UsersService } from 'src/domain/services/interfaces/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/infrastructure/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'User', schema: UserSchema
    }]),
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
