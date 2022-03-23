// import { Image } from '../../../domain/entities/Image';
// import { CreateImageDto } from '../../../domain/repositories/image/dtos/CreateImageDto';
// import { UpdateImageDto } from '../../../domain/repositories/image/dtos/UpdateImageDto';
// import { ImageSchemaModel } from '../../schemas/models/ImageSchemaModel';

// export class ImageMapper {
//   static mapCreateDtoToSchema(createDto: CreateImageDto): ImageSchemaModel {
//     return {
//       reference_id: createDto.referenceId,
//       reference_type: createDto.referenceType,
//       cloud_keys: createDto.cloudKeys,
//     };
//   }

//   static mapUpdateDtoToSchema(updateDto: UpdateImageDto): ImageSchemaModel {
//     return {
//       reference_id: updateDto.referenceId,
//       reference_type: updateDto.referenceType,
//       cloud_keys: updateDto.cloudKeys,
//     };
//   }

//   static mapSchemaToEntity(imageSchemaModel: ImageSchemaModel): Image {
//     return new Image(
//       imageSchemaModel._id,
//       imageSchemaModel.reference_id,
//       imageSchemaModel.reference_type,
//       imageSchemaModel.prefix,
//       imageSchemaModel.filenames,
//       imageSchemaModel.cloud_keys,
//     );
//   }
// }
