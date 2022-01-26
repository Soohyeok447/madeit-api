import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AddRoutineUsecaseDto } from '../use-cases/add-routine/dtos/AddRoutineUsecaseDto';
import { RoutineNameConflictException } from '../use-cases/add-routine/exceptions/RoutineNameConflictException';
import { UserNotAdminException } from '../use-cases/add-routine/exceptions/UserNotAdminException';
import { RoutineService } from './interface/RoutineService';
import { AddRoutineResponseDto } from '../use-cases/add-routine/dtos/AddRoutineResponseDto';
import { GetAllRoutinesUsecaseDto } from '../use-cases/get-all-routines/dtos/GetAllRoutinesUsecaseDto';
import { GetAllRoutinesResponseDto } from '../use-cases/get-all-routines/dtos/GetAllRoutinesResponseDto';
import { GetRoutineDetailUsecaseDto } from '../use-cases/get-routine-detail/dtos/GetRoutineDetailUsecaseDto';
import { GetRoutineDetailResponseDto } from '../use-cases/get-routine-detail/dtos/GetRoutineDetailResponseDto';
import { BuyRoutineUsecaseDto } from '../use-cases/buy-routine/dtos/BuyRoutineUsecaseDto';
import { GetAllRoutinesByCategoryUsecaseDto } from '../use-cases/get-all-routines-by-category/dtos/GetAllRoutinesByCategoryUsecaseDto';
import { GetAllRoutinesByCategoryResponseDto } from '../use-cases/get-all-routines-by-category/dtos/GetAllRoutinesByCategoryResponseDto';
import { ImageType } from 'src/domain/enums/ImageType';
import { ReferenceId } from 'src/domain/enums/ReferenceId';
import { ModifyRoutineUsecaseDto } from '../use-cases/modify-routine/dtos/ModifyRoutineUsecaseDto';
import { ModifyRoutineResponseDto } from '../use-cases/modify-routine/dtos/ModifyRoutineResponseDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ImageRepository } from '../../../repositories/image/ImageRepository';
import { ImageProvider } from '../../../providers/ImageProvider';
import { CreateImageDto } from '../../../repositories/image/dtos/CreateImageDto';
import { CreateRoutineDto } from '../../../repositories/routine/dtos/CreateRoutineDto';
import { UpdateRoutineDto } from '../../../repositories/routine/dtos/UpdateRoutineDto';
import { RoutineModel } from '../../../models/RoutineModel';
import { RoutineNotFoundException } from '../../../exception/RoutineNotFoundException';
@Injectable()
export class RoutineServiceImpl implements RoutineService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
    private readonly imageProvider: ImageProvider,
  ) {}

  public async addRoutine({
    userId,
    name,
    type,
    category,
    introductionScript,
    motivation,
    price,
    relatedProducts,
    cardnews,
    thumbnail,
  }: AddRoutineUsecaseDto): Promise<AddRoutineResponseDto> {
    const user = await this.userRepository.findOne(userId);
    const isAdmin = user['is_admin'];

    if (!isAdmin) {
      throw new UserNotAdminException();
    }

    const duplicatedRoutineName =
      await this.routineRepository.findOneByRoutineName(name);

    if (duplicatedRoutineName) {
      throw new RoutineNameConflictException();
    }

    let newThumbnailS3Object;
    let newCardnewsS3Objects;

    try {
      newThumbnailS3Object = this.imageProvider.putImageToS3(
        thumbnail,
        ImageType.routineThumbnail,
      );
    } catch (err) {
      throw Error('s3 bucket에 thumbnail origin 이미지 저장 실패');
    }

    try {
      newCardnewsS3Objects = cardnews.map((e) => {
        return this.imageProvider.putImageToS3(
          e,
          `${ImageType.cardnews}/${name}`,
        );
      });
    } catch (err) {
      throw Error('s3 bucket에 cardnews origin 이미지 저장 실패');
    }

    const thumbnailData: CreateImageDto =
      this.imageProvider.mapCreateImageDtoByS3Object(
        newThumbnailS3Object,
        ImageType.routineThumbnail,
        ReferenceId.Routine,
      );
    const cardnewsData: CreateImageDto =
      this.imageProvider.mapCreateImageDtoByS3Object(
        newCardnewsS3Objects,
        ImageType.cardnews,
        ReferenceId.Routine,
      );

    const createdThumbnail = await this.imageRepository.create(thumbnailData);
    const createdCardnews = await this.imageRepository.create(cardnewsData);

    const thumbnailId = createdThumbnail['_id'];
    const cardnewsId = createdCardnews['_id'];

    //cardNews Id랑 thumbnail Id를 추가한 createRoutineDTO
    const createRoutineData: CreateRoutineDto = {
      name,
      type,
      category,
      introduction_script: introductionScript,
      motivation,
      price,
      related_products: relatedProducts,
      thumbnail_id: thumbnailId,
      cardnews_id: cardnewsId,
    };

    const createdRoutine = await this.routineRepository.create(
      createRoutineData,
    );

    const output = {
      routine: createdRoutine,
    };

    this.imageRepository.update(cardnewsId, {
      reference_id: createdRoutine.id,
    });
    this.imageRepository.update(thumbnailId, {
      reference_id: createdRoutine.id,
    });

    return output;
  }

  public async modifyRoutine({
    userId,
    routineId,
    name,
    type,
    category,
    introductionScript,
    motivation,
    price,
    relatedProducts,
    cardnews,
    thumbnail,
  }: ModifyRoutineUsecaseDto): Promise<ModifyRoutineResponseDto> {
    const user = await this.userRepository.findOne(userId);
    const isAdmin = user['is_admin'];

    if (!isAdmin) {
      throw new UserNotAdminException();
    }

    const routine = await this.routineRepository.findOne(routineId);

    const duplicatedRoutineName =
      await this.routineRepository.findOneByRoutineName(name);

    if (duplicatedRoutineName && routine.name !== name) {
      throw new RoutineNameConflictException();
    }

    const originThumbnailObject = routine['thumbnail_id'];
    const originCardnewsObject = routine['cardnews_id'];

    const originThumbnailModel = this.imageProvider.mapDocumentToImageModel(
      originThumbnailObject,
    );
    const originCardnewsModel =
      this.imageProvider.mapDocumentToImageModel(originCardnewsObject);

    let thumbnailId = originThumbnailModel['_id'];
    let cardnewsId = originCardnewsModel['_id'];

    let newThumbnailS3Object: any;
    let newCardnewsS3Objects: any;

    if (thumbnail) {
      try {
        newThumbnailS3Object = this.imageProvider.putImageToS3(
          thumbnail,
          ImageType.routineThumbnail,
        );
      } catch (err) {
        throw Error('s3 bucket에 thumbnail origin 이미지 저장 실패');
      }

      const thumbnailData: CreateImageDto =
        this.imageProvider.mapCreateImageDtoByS3Object(
          newThumbnailS3Object,
          ImageType.routineThumbnail,
          ReferenceId.Routine,
          routine.id,
        );

      const createdThumbnail = await this.imageRepository.create(thumbnailData);

      thumbnailId = createdThumbnail['_id'];

      this.imageRepository.delete(originThumbnailModel.id);
      this.imageProvider.deleteImageFromS3(
        originThumbnailModel.key,
        originThumbnailModel.filenames[0],
      );
    }

    if (cardnews) {
      try {
        newCardnewsS3Objects = cardnews.map((e) => {
          return this.imageProvider.putImageToS3(
            e,
            `${ImageType.cardnews}/${name}`,
          );
        });
      } catch (err) {
        throw Error('s3 bucket에 cardnews origin 이미지 저장 실패');
      }

      const cardnewsData: CreateImageDto =
        this.imageProvider.mapCreateImageDtoByS3Object(
          newCardnewsS3Objects,
          ImageType.cardnews,
          ReferenceId.Routine,
          routine.id,
        );

      const createdCardnews = await this.imageRepository.create(cardnewsData);

      cardnewsId = createdCardnews['_id'];

      this.imageRepository.delete(originCardnewsModel.id);

      originCardnewsModel.filenames.forEach((filename) => {
        this.imageProvider.deleteImageFromS3(originCardnewsModel.key, filename);
      });
    }

    //cardNews Id랑 thumbnail Id를 추가한 UpdateRoutineDTO
    const updateRoutineData: UpdateRoutineDto = {
      name,
      type,
      category,
      introduction_script: introductionScript,
      motivation,
      price,
      related_products: relatedProducts,
      thumbnail_id: thumbnailId,
      cardnews_id: cardnewsId,
    };

    const updatedRoutine = await this.routineRepository.update(
      routineId,
      updateRoutineData,
    );

    const output: ModifyRoutineResponseDto = {
      routine: updatedRoutine,
    };

    return output;
  }

  public async getAllRoutines({
    next,
    size,
    resolution,
  }: GetAllRoutinesUsecaseDto): Promise<GetAllRoutinesResponseDto> {
    const routines = await this.routineRepository.findAll(size, next);

    //단 하나의 루틴도 못찾았을 때
    //nextCursor가 마지막 index 였을 때
    if (routines.length == 0 || !routines) {
      return {
        data: null,
        paging: {
          hasMore: false,
          nextCursor: null,
        },
      };
    }

    const hasMore = routines.length < size ? false : true;

    const nextCursor = hasMore ? routines[routines.length - 1]['_id'] : null;

    const mappedResult: RoutineModel[] = await Promise.all(
      routines.map(async (routine) => {
        const thumbnailModel = this.imageProvider.mapDocumentToImageModel(
          routine['thumbnail_id'],
        );

        const thumbnailBuffer =
          await this.imageProvider.requestImageToCloudfront(
            resolution,
            thumbnailModel,
          );

        const {
          introduction_script: __,
          related_products: ____,
          _id: _____,
          cardnews_id: ______,
          thumbnail_id: _______,
          ...others
        }: any = routine;

        return {
          id: routine['_id'],
          thumbnailUrl: routine['thumbnail_url'],
          introductionScript: routine['introduction_script'],
          introductionImageUrl: routine['introduction_image_url'],
          relatedProducts: routine['related_products'],
          thumbnail: thumbnailBuffer,
          ...others,
        };
      }),
    );

    return {
      data: mappedResult,
      paging: {
        hasMore,
        nextCursor,
      },
    };
  }

  public async getAllRoutinesByCategory({
    next,
    size,
    category,
    resolution,
  }: GetAllRoutinesByCategoryUsecaseDto): Promise<GetAllRoutinesByCategoryResponseDto> {
    const routines = await this.routineRepository.findAllByCategory(
      category,
      size,
      next,
    );

    //단 하나의 루틴도 못찾았을 때
    //nextCursor가 마지막 index 였을 때
    if (routines.length == 0 || !routines) {
      return {
        data: null,
        paging: {
          hasMore: false,
          nextCursor: null,
        },
      };
    }

    const hasMore = routines.length < size ? false : true;

    const nextCursor = hasMore ? routines[routines.length - 1]['_id'] : null;

    const mappedResult: RoutineModel[] = await Promise.all(
      routines.map(async (routine) => {
        const thumbnailModel = this.imageProvider.mapDocumentToImageModel(
          routine['thumbnail_id'],
        );

        const thumbnailBuffer =
          await this.imageProvider.requestImageToCloudfront(
            resolution,
            thumbnailModel,
          );

        const {
          introduction_script: __,
          related_products: ____,
          _id: _____,
          cardnews_id: ______,
          thumbnail_id: _______,
          ...others
        }: any = routine;

        return {
          id: routine['_id'],
          thumbnailUrl: routine['thumbnail_url'],
          introductionScript: routine['introduction_script'],
          introductionImageUrl: routine['introduction_image_url'],
          relatedProducts: routine['related_products'],
          thumbnail: thumbnailBuffer,
          ...others,
        };
      }),
    );

    return {
      data: mappedResult,
      paging: {
        hasMore,
        nextCursor,
      },
    };
  }

  public async getRoutineDetail({
    routineId,
    resolution,
  }: GetRoutineDetailUsecaseDto): Promise<GetRoutineDetailResponseDto> {
    const routine: RoutineModel = await this.routineRepository.findOne(routineId);

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    const thumbnailModel = this.imageProvider.mapDocumentToImageModel(
      routine['thumbnail_id'],
    );
    const cardnewsModel = this.imageProvider.mapDocumentToImageModel(
      routine['cardnews_id'],
    );

    const thumbnailBuffer = await this.imageProvider.requestImageToCloudfront(
      resolution,
      thumbnailModel,
    );
    const cardnewsBuffer = await this.imageProvider.requestImageToCloudfront(
      resolution,
      cardnewsModel,
    );

    const {
      introduction_script: __,
      related_products: ____,
      _id: _____,
      cardnews_id: ______,
      thumbnail_id: _______,
      ...others
    }: any = routine;

    const newRoutine: RoutineModel = {
      id: routine['_id'],
      thumbnail: thumbnailBuffer,
      cardnews: cardnewsBuffer,
      introductionScript: routine['introduction_script'],
      relatedProducts: routine['related_products'],
      ...others,
    };

    return newRoutine;
  }

  /**
     * 유저가 상세페이지 구경 중 -> 구매 버튼을 누름 -> 스케줄을 짜고 확정(저장) 
-> 0원 or XXXXX원 결제 (0원일 경우 유저에게는 결제 과정은 생략)
     */
  public async buyRoutine({
    userId,
    routineId,
  }: BuyRoutineUsecaseDto): Promise<void> {
    //TODO 유료인 경우
    //TODO 무료인 경우

    return;
  }
}
