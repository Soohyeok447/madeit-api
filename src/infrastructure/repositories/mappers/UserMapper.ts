import { User } from '../../../domain/entities/User';
import { CreateUserDto } from '../../../domain/repositories/user/dtos/CreateUserDto';
import { UpdateUserDto } from '../../../domain/repositories/user/dtos/UpdateUserDto';
import { UserSchemaModel } from '../../schemas/models/UserSchemaModel';

export class UserMapper {
  public static mapCreateDtoToSchema(
    createDto: CreateUserDto,
  ): UserSchemaModel {
    return {
      user_id: createDto.userId,
      provider: createDto.provider,
      username: createDto.username,
      age: createDto.age,
      goal: createDto.goal,
      status_message: createDto.statusMessage,
    };
  }

  public static mapUpdateDtoToSchema(
    updateDto: UpdateUserDto,
  ): UserSchemaModel {
    return {
      username: updateDto.username,
      avatar_id: updateDto.avatar,
      email: updateDto.email,
      user_id: updateDto.userId,
      age: updateDto.age,
      goal: updateDto.goal,
      status_message: updateDto.statusMessage,
      refresh_token: updateDto.refreshToken,
      provider: updateDto.provider,
      is_admin: updateDto.isAdmin,
      exp: updateDto.exp,
      point: updateDto.point,
      level: updateDto.level,
      did_routines_in_total: updateDto.didRoutinesInTotal,
      did_routines_in_month: updateDto.didRoutinesInMonth,
    };
  }

  public static mapSchemaToEntity(userSchemaModel: UserSchemaModel): User {
    return new User(
      userSchemaModel._id,
      userSchemaModel.user_id,
      userSchemaModel.email,
      userSchemaModel.username,
      userSchemaModel.age,
      userSchemaModel.goal,
      userSchemaModel.status_message,
      userSchemaModel.provider,
      userSchemaModel.refresh_token,
      userSchemaModel.is_admin,
      userSchemaModel.avatar_id,
      userSchemaModel.exp,
      userSchemaModel.point,
      userSchemaModel.did_routines_in_total,
      userSchemaModel.did_routines_in_month,
      userSchemaModel.level,
    );
  }
}
