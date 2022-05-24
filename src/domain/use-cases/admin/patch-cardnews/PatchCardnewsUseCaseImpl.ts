import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { PatchCardnewsUseCaseParams } from './dtos/PatchCardnewsUseCaseParams';
import { PatchCardnewsUseCase } from './PatchCardnewsUseCase';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { ImageModel } from '../../../models/ImageModel';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { AdminNotFoundException } from '../../admin/common/exceptions/AdminNotFoundException';
import { Admin } from '../../../entities/Admin';
import { InvalidAdminTokenException } from '../../admin/common/exceptions/InvalidAdminTokenException';
import {
  AdminAuthProvider,
  Payload,
} from '../../../providers/AdminAuthProvider';
import { AdminRepository } from '../../../repositories/admin/AdminRepository';
import { PatchCardnewsResponseDto } from './dtos/PatchCardnewsResponseDto';
import { RecommendedRoutineNotFoundException } from '../../recommended-routine/common/exceptions/RecommendedRoutineNotFoundException';

@Injectable()
export class PatchCardnewsUseCaseImpl implements PatchCardnewsUseCase {
  public constructor(
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
    private readonly _logger: LoggerProvider,
    private readonly _adminRepository: AdminRepository,
    private readonly _adminAuthProvider: AdminAuthProvider,
  ) {}

  public async execute({
    recommendedRoutineId,
    cardnews,
    accessToken,
  }: PatchCardnewsUseCaseParams): Promise<PatchCardnewsResponseDto> {
    this._logger.setContext('PatchCardnews');

    const payload: Payload =
      this._adminAuthProvider.verifyAccessToken(accessToken);

    if (!payload)
      throw new InvalidAdminTokenException(
        this._logger.getContext(),
        `유효하지않은 어드민 토큰입니다.`,
      );

    const admin: Admin = await this._adminRepository.findOneByIndentifier(
      payload.id,
    );

    if (!admin)
      throw new AdminNotFoundException(
        this._logger.getContext(),
        `존재하지 않는 어드민`,
      );

    //recommendedRoutineId로 추천루틴 불러오기
    const existingRecommendedRoutine: RecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    //추천루틴 있나 없나 검사 없으면 exception
    if (!existingRecommendedRoutine) {
      throw new RecommendedRoutineNotFoundException(
        this._logger.getContext(),
        `미존재 추천루틴에 카드뉴스 추가 시도.`,
      );
    }

    //기존 카드뉴스
    const existingCardnews: any = existingRecommendedRoutine.cardnewsId ?? null;

    //만약 추천루틴의 카드뉴스가 이미 있으면 클라우드, 레포지터리에 있는 썸네일 삭제
    if (existingCardnews) {
      this._imageRepository.delete(existingCardnews['_id']);

      existingCardnews['cloud_keys'].forEach((cloudKey: string) => {
        this._imageProvider.deleteImageFileFromCloudDb(cloudKey);
      });
    }

    const cardnewsCloudKeys: string[] = cardnews.map((card) => {
      return this._imageProvider.putImageFileToCloudDb(
        card,
        ImageType.recommendedRoutineCardnews,
        existingRecommendedRoutine.title,
      );
    });

    const createCardnewsDto: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByCloudKey(
        cardnewsCloudKeys,
        ImageType.recommendedRoutineCardnews,
        ReferenceModel.RecommendedRoutine,
        recommendedRoutineId,
      );

    const createdCardnews: ImageModel = await this._imageRepository.create(
      createCardnewsDto,
    );

    await this._recommendedRoutineRepository.update(recommendedRoutineId, {
      cardnewsId: createdCardnews['_id'],
    });

    return {};
  }
}
