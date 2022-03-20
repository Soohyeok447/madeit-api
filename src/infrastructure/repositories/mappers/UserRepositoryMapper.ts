import { UserModel } from '../../../domain/models/UserModel';
import { CreateUserDto } from '../../../domain/repositories/user/dtos/CreateUserDto';
import { UpdateUserDto } from '../../../domain/repositories/user/dtos/UpdateUserDto';
import { UserSchemaModel } from '../../schemas/models/UserSchemaModel';

export class UserMapper {
  static mapCreateDtoToSchema(createDto: CreateUserDto): UserSchemaModel {
    return {
      user_id: createDto.userId,
      provider: createDto.provider,
      username: createDto.username,
      age: createDto.age,
      goal: createDto.goal,
      status_message: createDto.statusMessage,
    };
  }

  static mapUpdateDtoToSchema(updateDto: UpdateUserDto): UserSchemaModel {
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

  static mapSchemaToEntity(userSchemaModel: UserSchemaModel): UserModel {
    return {
      id: userSchemaModel._id,
      userId: userSchemaModel.user_id,
      email: userSchemaModel.email,
      username: userSchemaModel.username,
      age: userSchemaModel.age,
      goal: userSchemaModel.goal,
      statusMessage: userSchemaModel.status_message,
      provider: userSchemaModel.provider,
      isAdmin: userSchemaModel.is_admin,
      avatar: userSchemaModel.avatar_id,
      exp: userSchemaModel.exp,
      point: userSchemaModel.point,
      didRoutinesInTotal: userSchemaModel.did_routines_in_total,
      didRoutinesInMonth: userSchemaModel.did_routines_in_month,
      level: userSchemaModel.level,
      refreshToken: userSchemaModel.refresh_token,
    };
  }
}
