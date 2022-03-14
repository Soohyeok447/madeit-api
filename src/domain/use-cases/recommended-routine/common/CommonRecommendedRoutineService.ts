import { Injectable } from '@nestjs/common';
import { Category } from '../../../common/enums/Category';
import { RecommendedRoutineModel } from '../../../models/RecommendedRoutineModel';
import {
  healthScript,
  meditationScript,
  motivationScript,
  readingScript,
} from './constant/ScriptsOfProveMethodByCategory';
import { RecommendedRoutineNotFoundException } from './exceptions/RecommendedRoutineNotFoundException';

export interface HowToProveYouDidIt {
  script?: string;
  imageUrl?: string;
}

@Injectable()
export class CommonRecommendedRoutineService {
  static assertRecommendedRoutineExistence(
    recommendedRoutine: RecommendedRoutineModel,
  ) {
    if (!recommendedRoutine) {
      throw new RecommendedRoutineNotFoundException();
    }
  }

  static getHowToProveByCategory(category: Category): HowToProveYouDidIt {
    switch (category) {
      case Category.Health: {
        return {
          script: healthScript,
          imageUrl: `${process.env.AWS_CLOUDFRONT_URL}/how-to-prove/health`,
        };
      }
      case Category.Meditation: {
        return {
          script: meditationScript,
          imageUrl: null,
        };
      }
      case Category.Reading: {
        return {
          script: readingScript,
          imageUrl: `${process.env.AWS_CLOUDFRONT_URL}/how-to-prove/reading`,
        };
      }
      case Category.Motivation: {
        return {
          script: motivationScript,
          imageUrl: null,
        };
      }
      default:
        throw new Error('다른 경우를 실수로 구현하지 않음');
    }
  }
}
