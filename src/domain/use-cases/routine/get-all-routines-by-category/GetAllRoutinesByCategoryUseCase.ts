import { RoutineModel } from '../../../../domain/models/RoutineModel';
import { ImageProvider } from '../../../../domain/providers/ImageProvider';
import { RoutineRepository } from '../../../../domain/repositories/routine/RoutineRepository';
import { UseCase } from '../../UseCase';
import { GetAllRoutinesByCategoryResponse } from '../response.index';
import { GetAllRoutinesByCategoryUsecaseDto } from './dtos/GetAllRoutinesByCategoryUsecaseDto';

/**
 * 카테고리를 키값으로 모든 루틴목록을 가져옴
 * cursor based pagination
 */
export class GetAllRoutinesByCategoryUseCase
  implements
    UseCase<
      GetAllRoutinesByCategoryUsecaseDto,
      GetAllRoutinesByCategoryResponse
    >
{
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _imageProvider: ImageProvider,
  ) {}

  public async execute({
    next,
    size,
    category,
    resolution,
  }: GetAllRoutinesByCategoryUsecaseDto): GetAllRoutinesByCategoryResponse {
    const routines = await this._routineRepository.findAllByCategory(
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
        const thumbnailModel = this._imageProvider.mapDocumentToImageModel(
          routine['thumbnail_id'],
        );

        const thumbnailBuffer =
          await this._imageProvider.requestImageToCloudfront(
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
}
