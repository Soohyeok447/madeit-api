import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../../../domain/repositories/cart/CartRepository';
import {
  CommonRecommendedRoutineService,
  HowToProveYouDidIt,
} from '../../recommended-routine/common/CommonRecommendedRoutineService';
import { GetCartsResponse } from '../response.index';
import { GetCartsResponseDto } from './dtos/GetCartsResponseDto';
import { GetCartsUsecaseParams } from './dtos/GetCartsUsecaseParams';
import { GetCartsUseCase } from './GetCartsUseCase';

@Injectable()
export class GetCartsUseCaseImpl implements GetCartsUseCase {
  constructor(private readonly _cartRepository: CartRepository) {}

  public async execute({ userId }: GetCartsUsecaseParams): GetCartsResponse {
    const result = await this._cartRepository.findAll(userId);

    if (!result.length) {
      return [];
    }

    const mappedOutput: GetCartsResponseDto[] = result.map((cart) => {
      const recommendedRoutine = cart['recommended_routine_id'];

      const howToProveYouDidIt: HowToProveYouDidIt =
        CommonRecommendedRoutineService.getHowToProveByCategory(
          recommendedRoutine['category'],
        );

      return {
        id: recommendedRoutine['_id'],
        title: recommendedRoutine['title'],
        category: recommendedRoutine['category'],
        introduction: recommendedRoutine['introduction'],
        fixedFields: recommendedRoutine['fixed_fields'],
        hour: recommendedRoutine['hour'],
        minute: recommendedRoutine['minute'],
        days: recommendedRoutine['days'],
        alarmVideoId: recommendedRoutine['alarm_video_id'],
        contentVideoId: recommendedRoutine['content_video_id'],
        timerDuration: recommendedRoutine['time_duration'],
        price: recommendedRoutine['price'],
        point: recommendedRoutine['point'],
        exp: recommendedRoutine['exp'],
        howToProveScript: howToProveYouDidIt.script,
        howToProveImageUrl: howToProveYouDidIt.imageUrl,
      };
    });

    return mappedOutput;
  }
}
