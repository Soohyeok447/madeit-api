import { ImageModel } from "../../../../../domain/models/ImageModel";
import { UserModel } from "../../../../../domain/models/UserModel";
import { ImageProvider } from "../../../../../domain/providers/ImageProvider";
import { UserRepository } from "../../../../../domain/repositories/user/UserRepository";
import { UseCase } from "../../../../../domain/use-cases/UseCase";
import { FindUserResponse } from "../../response.index";
import { FindUserResponseDto } from "./dtos/FindUserResponseDto";
import { FindUserUsecaseDto } from "./dtos/FindUserUsecaseDto";
import { UserNotRegisteredException } from "./exceptions/UserNotRegisteredException";

/**
 * id로 유저를 찾음
 */

export class FindUserUseCase implements UseCase<FindUserUsecaseDto, FindUserResponse> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageProvider: ImageProvider,
  ) { }

  public async execute({
    id,
    resolution,
  }: FindUserUsecaseDto): FindUserResponse {
    const user: UserModel = await this.userRepository.findOne(id);

    if (!user.gender || !user.job || !user.username || !user.birth) {
      throw new UserNotRegisteredException();
    }

    const profile: ImageModel = user['profile_id'] ?? null;

    let profileImage;

    if (profile) {
      const profileModel = this.imageProvider.mapDocumentToImageModel(profile);

      profileImage = await this.imageProvider.requestImageToCloudfront(
        resolution,
        profileModel,
      );
    }

    const output: FindUserResponseDto = {
      profileImage,
      ...user,
    };

    return output;
  }
}