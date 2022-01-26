import { ImageType } from "../../../../../domain/enums/ImageType";
import { ReferenceId } from "../../../../../domain/enums/ReferenceId";
import { ImageRepository } from "../../../../../domain/repositories/image/ImageRepository";
import { UserRepository } from "../../../../../domain/repositories/user/UserRepository";
import { ImageProvider } from "../../../../../domain/providers/ImageProvider";
import { UseCase } from "../../../../../domain/use-cases/UseCase";
import { ModifyUserUsecaseDto } from "./dtos/ModifyUserUsecaseDto";
import { UpdateUserDto } from "../../../../../domain/repositories/user/dtos/UpdateUserDto";
import { CreateImageDto } from "../../../../../domain/repositories/image/dtos/CreateImageDto";
import { InvalidUsernameException } from "../do-user-onboarding/exceptions/InvalidUsernameException";
import { UsernameConflictException } from "../do-user-onboarding/exceptions/UsernameConflictException";
import { ModifyUserResponse } from "../../response.index";

/**
  * 유저 정보 수정
  *
  * 프로필 사진 수정, 삭제 가능
  */
export class ModifyUserUseCase implements UseCase<ModifyUserUsecaseDto, ModifyUserResponse>{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
    private readonly imageProvider: ImageProvider,
  ) { }

  public async execute({
    id,
    profile,
    username,
    birth,
    job,
    gender,
  }: ModifyUserUsecaseDto): Promise<void> {
    const assertUserResult = await this.userRepository.findOneByUsername(
      username,
    );

    if (assertUserResult) {
      throw new UsernameConflictException();
    }

    if (username.length < 2 || username.length > 8) {
      throw new InvalidUsernameException();
    }

    const user = await this.userRepository.findOne(id);

    let profileId: string = null;
    let newProfileS3Object;

    if (profile) {
      try {
        newProfileS3Object = this.imageProvider.putImageToS3(
          profile,
          ImageType.userProfile,
        );
      } catch (err) {
        throw Error('s3 bucket에 profile origin 이미지 저장 실패');
      }

      const newImageData: CreateImageDto =
        this.imageProvider.mapCreateImageDtoByS3Object(
          newProfileS3Object,
          ImageType.userProfile,
          ReferenceId.User,
          id,
        );

      //새로운 이미지 db에 저장
      const createdImage = await this.imageRepository.create(newImageData);
      profileId = createdImage['_id'];
    }

    const originProfileObject = user['profile_id'] ?? null;

    if (originProfileObject) {
      const originProfileModel =
        this.imageProvider.mapDocumentToImageModel(originProfileObject);

      await this.imageRepository.delete(originProfileObject);

      this.imageProvider.deleteImageFromS3(
        originProfileModel.key,
        originProfileModel.filenames[0],
      );
    }

    const onboardingData: UpdateUserDto = {
      birth,
      gender,
      job,
      username,
      profile_id: profileId,
    };

    await this.userRepository.update(id, onboardingData);
  }
}