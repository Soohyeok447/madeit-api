import { Injectable } from '@nestjs/common';
import { ImageType } from '../../../common/enums/ImageType';
import { ReferenceModel } from '../../../common/enums/ReferenceModel';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { InformationBoard } from '../../../entities/InformationBoard';
import { User } from '../../../entities/User';
import { ImageModel } from '../../../models/ImageModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { InformationBoardRepository } from '../../../repositories/information-board/InformationBoardRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { PostNotFoundException } from '../common/exceptions/PostNotFoundException';
import { PutCardnewsResponse } from '../response.index';
import { PutCardnewsUseCaseParams } from './dtos/PutCardnewsUseCaseParams';
import { PutCardnewsUseCase } from './PutCardnewsUseCase';

@Injectable()
export class PutCardnewsUseCaseImpl implements PutCardnewsUseCase {
  public constructor(
    private readonly _informationBoardRepository: InformationBoardRepository,
    private readonly _userRepository: UserRepository,
    private readonly _imageProvider: ImageProvider,
    private readonly _imageRepository: ImageRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    postId,
    cardnews,
  }: PutCardnewsUseCaseParams): PutCardnewsResponse {
    this._logger.setContext('PutCardnews(Info-Board)');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 정보게시판의 게시글에 카드뉴스를 추가 시도.`,
      );
    }

    if (!user.isAdmin) {
      throw new UserNotAdminException(
        this._logger.getContext(),
        `비어드민 유저가 정보게시판의 게시글에 카드뉴스를 추가 시도.`,
      );
    }

    const existingPost: InformationBoard =
      await this._informationBoardRepository.findOne(postId);

    if (!existingPost) {
      throw new PostNotFoundException(
        this._logger.getContext(),
        `미존재 게시글에 카드뉴스 추가 시도`,
      );
    }

    //기존 카드뉴스Id
    const existingCardnewsId: string = existingPost.cardnews ?? null;

    const existingCardnews: ImageModel = await this._imageRepository.findOne(
      existingCardnewsId,
    );

    //만약 게시글의 카드뉴스가 이미 있으면 클라우드, 레포지터리에 있는 썸네일 삭제
    if (existingCardnews) {
      this._imageRepository.delete(existingCardnewsId);

      existingCardnews['cloud_keys'].forEach((cloudKey: string) => {
        this._imageProvider.deleteImageFileFromCloudDb(cloudKey);
      });
    }

    const cardnewsCloudKeys: string[] = cardnews.map((card) => {
      return this._imageProvider.putImageFileToCloudDb(
        card,
        ImageType.infoBoard,
        existingPost.title,
      );
    });

    const createCardnewsDto: CreateImageDto =
      this._imageProvider.mapCreateImageDtoByCloudKey(
        cardnewsCloudKeys,
        ImageType.infoBoard,
        ReferenceModel.InfoBoard,
        postId,
      );

    const createdCardnews: ImageModel = await this._imageRepository.create(
      createCardnewsDto,
    );

    await this._informationBoardRepository.modify(postId, {
      cardnewsId: createdCardnews['_id'],
    });

    return {};
  }
}
