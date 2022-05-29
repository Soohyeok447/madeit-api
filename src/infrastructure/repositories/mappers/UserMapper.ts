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
      avatar_id: updateDto.avatarId,
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
    };
  }

  public static mapSchemaToEntity(userSchemaModel: UserSchemaModel): User {
    return new User(
      userSchemaModel._id.toString(),
      userSchemaModel.user_id,
      userSchemaModel.email,
      userSchemaModel.username,
      userSchemaModel.age,
      userSchemaModel.goal,
      userSchemaModel.status_message,
      userSchemaModel.provider,
      userSchemaModel.refresh_token,
      userSchemaModel.is_admin,
      userSchemaModel.exp,
      userSchemaModel.point,
      userSchemaModel.level,
      userSchemaModel.created_at,
      userSchemaModel.updated_at,
      userSchemaModel.deleted_at,
      userSchemaModel.avatar_id ? userSchemaModel.avatar_id.toString() : null,
    );
  }
}
