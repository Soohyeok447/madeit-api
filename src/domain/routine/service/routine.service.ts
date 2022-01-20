import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AddRoutineInput } from '../use-cases/add-routine/dtos/add_routine.input';
import { RoutineNameConflictException } from '../use-cases/add-routine/exceptions/routine_conflict.exception';
import { RoutineNotFoundException } from '../../common/exceptions/routine_not_found.exception';
import { UserNotAdminException } from '../use-cases/add-routine/exceptions/user_not_admin.exception';
import { Routine } from '../../common/models/routine.model';
import { RoutineRepository } from '../../common/repositories/routine/routine.repsotiroy';
import { UserRepository } from '../../common/repositories/user/users.repository';
import { RoutineService } from './interface/routine.service';
import { AddRoutineOutput } from '../use-cases/add-routine/dtos/add_routine.output';
import { GetAllRoutinesInput } from '../use-cases/get-all-routines/dtos/get_all_routines.input';
import { GetAllRoutinesOutput } from '../use-cases/get-all-routines/dtos/get_all_routines.output';
import { GetRoutineDetailInput } from '../use-cases/get-routine-detail/dtos/get_routine_detail.input';
import { GetRoutineDetailOutput } from '../use-cases/get-routine-detail/dtos/get_routine_detail.output';
import { InvalidRoutineIdException } from '../use-cases/get-routine-detail/exceptions/invalid_routine_id.exception';
import { BuyRoutineInput } from '../use-cases/buy-routine/dtos/buy_routine.input';
import { GetAllRoutinesByCategoryInput } from '../use-cases/get-all-routines-by-category/dtos/get_all_routines_by_category.input';
import { GetAllRoutinesByCategoryOutput } from '../use-cases/get-all-routines-by-category/dtos/get_all_routines_by_category.output';
import { CreateRoutineDto } from 'src/domain/common/repositories/routine/dtos/create.dto';
import { RoutineType } from 'src/domain/common/enums/routine_type.enum';
import { Category } from 'src/domain/common/enums/category.enum';
import { CreateImageDto } from 'src/domain/common/repositories/image/dtos/create.dto';
import { ImageType } from 'src/domain/common/enums/image.enum';
import { ReferenceId } from 'src/domain/common/enums/reference_id.enum';
import { ImageRepository } from 'src/domain/common/repositories/image/image.repository';
import { ImageProvider } from 'src/domain/common/providers/image.provider';
@Injectable()
export class RoutineServiceImpl implements RoutineService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
    private readonly imageProvider: ImageProvider,
  ) { }

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
  }: AddRoutineInput): Promise<AddRoutineOutput> {
    //user가 admin인지 검사
    const user = await this.userRepository.findOne(userId);

    if (!user['is_admin']) {
      throw new UserNotAdminException();
    }

    //routine name 중복검사
    const result = await this.routineRepository.findOneByRoutineName(
      name,
    );

    if (result) {
      throw new RoutineNameConflictException();
    }

    let putThumbnailResult;
    let putCardnewsResult;

    try {
      // thumbnail s3에 저장
      putThumbnailResult = this.imageProvider.putImageToS3(thumbnail, ImageType.routineThumbnail);
    }
    catch (err) {
      throw Error('s3 bucket에 thumbnail origin 이미지 저장 실패');
    }

    try {      
      // cardnews s3에 저장
      putCardnewsResult = cardnews.map((e) => {
        return this.imageProvider.putImageToS3(e,`${ImageType.cardnews}/${name}`);
      })
    } catch (err) {
      throw Error('s3 bucket에 cardnews origin 이미지 저장 실패');
    }


    // routine 썸네일 레포에 저장
    const thumbnailS3Keys = putThumbnailResult['params']['Key'].split('/');
    const thumbnailImageType = thumbnailS3Keys[1];
    const thumbnailFilename = thumbnailS3Keys[2];


    const routineThumbnailData: CreateImageDto = {
      type: ImageType.routineThumbnail,
      reference_model: ReferenceId.Routine,
      key: thumbnailImageType,
      filenames: [thumbnailFilename]
    }

    const createdThumbnail = await this.imageRepository.create(routineThumbnailData);
    const thumbnailId = createdThumbnail['_id'];


    //cardNews 이미지 레포에 저장
    const cardnewsS3Keys = putCardnewsResult[0]['params']['Key'].split('/');
    const cardnewsImageType = `${cardnewsS3Keys[1]}/${cardnewsS3Keys[2]}`;
    const cardnewsFilenames = putCardnewsResult.map(e => {
      return e['params']['Key'].split('/')[3];
    })
    
    const cardnewsData: CreateImageDto = {
      type: ImageType.cardnews,
      reference_model: ReferenceId.Routine,
      key: cardnewsImageType,
      filenames: cardnewsFilenames
    }

    const createdCardnews = await this.imageRepository.create(cardnewsData);
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
      cardnews_id: cardnewsId
    };

    const routine = await this.routineRepository.create(createRoutineData);

    const output = {
      routine,
    };

    await this.imageRepository.update(cardnewsId, { reference_id: routine.id });
    await this.imageRepository.update(thumbnailId, { reference_id: routine.id });

    return output;
  }

  

  public async getAllRoutines({
    next,
    size,
    resolution
  }: GetAllRoutinesInput): Promise<GetAllRoutinesOutput> {
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

    const mappedResult: Routine[] = await Promise.all(routines.map(async (routine) => {
      const thumbnailModel = this.imageProvider.mapDocumentToImageModel(routine['thumbnail_id']);

      const thumbnailBuffer = await this.imageProvider.requestImageToCloudfront(resolution, thumbnailModel);
      
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
    }));

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
    resolution
  }: GetAllRoutinesByCategoryInput): Promise<GetAllRoutinesByCategoryOutput> {
    const routines = await this.routineRepository.findAllByCategory(category, size, next);

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

    const mappedResult: Routine[] = await Promise.all(routines.map(async (routine) => {
      const thumbnailModel = this.imageProvider.mapDocumentToImageModel(routine['thumbnail_id']);

      const thumbnailBuffer = await this.imageProvider.requestImageToCloudfront(resolution, thumbnailModel);
      
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
    }));

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
  }: GetRoutineDetailInput): Promise<GetRoutineDetailOutput> {

    const routine: Routine = await this.routineRepository.findOne(routineId);

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    const thumbnailModel = this.imageProvider.mapDocumentToImageModel(routine['thumbnail_id']);
    const cardnewsModel = this.imageProvider.mapDocumentToImageModel(routine['cardnews_id']);

    const thumbnailBuffer = await this.imageProvider.requestImageToCloudfront(resolution, thumbnailModel);
    const cardnewsBuffer = await this.imageProvider.requestImageToCloudfront(resolution, cardnewsModel);

    const {
      introduction_script: __,
      related_products: ____,
      _id: _____,
      cardnews_id: ______,
      thumbnail_id: _______,
      ...others
    }: any = routine;

    const newRoutine: Routine = {
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
  }: BuyRoutineInput): Promise<void> {
    //TODO 유료인 경우
    //TODO 무료인 경우

    return;
  }
}

