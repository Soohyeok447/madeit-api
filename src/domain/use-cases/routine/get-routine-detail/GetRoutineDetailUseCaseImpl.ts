import { Injectable } from '@nestjs/common';
import { RoutineNotFoundException } from '../../../common/exceptions/customs/RoutineNotFoundException';
import { RoutineModel } from '../../../models/RoutineModel';
import { ImageProvider } from '../../../providers/ImageProvider';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { GetRoutineDetailResponse } from '../response.index';
import { GetRoutineDetailUsecaseParams } from './dtos/GetRoutineDetailUsecaseParams';
import { GetRoutineDetailUseCase } from './GetRoutineDetailUseCase';

@Injectable()
export class GetRoutineDetailUseCaseImpl implements GetRoutineDetailUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({
    routineId,
  }: GetRoutineDetailUsecaseParams): GetRoutineDetailResponse {
    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    if (!routine) {
      throw new RoutineNotFoundException();
    }

    let thumbnailBuffer;
    let cardnewsBuffer;

    if (routine['thumbnail_id']) {
      const thumbnailModel = this._imageProvider.mapDocumentToImageModel(
        routine['thumbnail_id'],
      );

      thumbnailBuffer = await this._imageProvider.requestImageToCloudfront(
        thumbnailModel,
      );
    }

    if (routine['cardnews_id']) {
      const cardnewsModel = this._imageProvider.mapDocumentToImageModel(
        routine['cardnews_id'],
      );

      cardnewsBuffer = await this._imageProvider.requestImageToCloudfront(
        cardnewsModel,
      );
    }

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
