import { Serial } from '../../../domain/entities/Serial';
import { CreateSerialDto } from '../../../domain/repositories/serial/dtos/CreateSerialDto';
import { UpdateSerialDto } from '../../../domain/repositories/serial/dtos/UpdateSerialDto';
import { SerialSchemaModel } from '../../schemas/models/SerialSchemaModel';

export class SerialMapper {
  public static mapCreateDtoToSchema(createDto: CreateSerialDto): {
    user_id: string;
    email: string;
    serial: string;
  } {
    return {
      user_id: createDto.userId,
      email: createDto.email,
      serial: createDto.serial,
    };
  }

  public static mapUpdateDtoToSchema(
    updateDto: UpdateSerialDto,
  ): SerialSchemaModel {
    return {
      email: updateDto.email,
      serial: updateDto.serial,
    };
  }

  public static mapSchemaToEntity(schemaModel: SerialSchemaModel): Serial {
    return new Serial(
      schemaModel._id,
      schemaModel.user_id,
      schemaModel.email,
      schemaModel.serial,
    );
  }
}
