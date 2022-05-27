import { Admin } from '../../../domain/entities/Admin';
import { CreateAdminDto } from '../../../domain/repositories/admin/dtos/CreateAdminDto';
import { UpdateAdminDto } from '../../../domain/repositories/admin/dtos/UpdateAdminDto';
import { AdminSchemaModel } from '../../schemas/models/AdminSchemaModel';

export class AdminMapper {
  public static mapCreateDtoToSchema(createDto: CreateAdminDto): {
    identifier: string;
    password: string;
  } {
    return {
      identifier: createDto.identifier,
      password: createDto.password,
    };
  }

  public static mapUpdateDtoToSchema(
    updateDto: UpdateAdminDto,
  ): AdminSchemaModel {
    return {
      identifier: updateDto.identifier,
      password: updateDto.password,
    };
  }

  public static mapSchemaToEntity(schemaModel: AdminSchemaModel): Admin {
    return new Admin(
      schemaModel._id.toString(),
      schemaModel.identifier,
      schemaModel.password,
    );
  }
}
