import { RoutineNotFoundException } from '../../../../domain/common/exceptions/RoutineNotFoundException';
import { RoutineModel } from '../../../../domain/models/RoutineModel';
import { ImageProvider } from '../../../../domain/providers/ImageProvider';
import { RoutineRepository } from '../../../../domain/repositories/routine/RoutineRepository';
import { UseCase } from '../../UseCase';
import { GetRoutineDetailResponse } from '../response.index';
import { GetRoutineDetailUsecaseDto } from './dtos/GetRoutineDetailUsecaseDto';

/**
 * 루틴 상세정보를 가져옴
 */
export class GetRoutineDetailUseCase
  implements UseCase<GetRoutineDetailUsecaseDto, GetRoutineDetailResponse>
{
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({
    routineId,
    resolution,
  }: GetRoutineDetailUsecaseDto): GetRoutineDetailResponse {
    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    const thumbnailModel = this._imageProvider.mapDocumentToImageModel(
      routine['thumbnail_id'],
    );
    const cardnewsModel = this._imageProvider.mapDocumentToImageModel(
      routine['cardnews_id'],
    );

    const thumbnailBuffer = await this._imageProvider.requestImageToCloudfront(
      resolution,
      thumbnailModel,
    );
    const cardnewsBuffer = await this._imageProvider.requestImageToCloudfront(
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
}
