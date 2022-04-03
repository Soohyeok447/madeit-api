import { Injectable } from '@nestjs/common';
import { Category } from '../../../common/enums/Category';
import {
  healthScript,
  meditationScript,
  motivationScript,
  readingScript,
} from './constant/ScriptsOfProveMethodByCategory';

export interface HowToProveYouDidIt {
  script?: string;
  imageUrl?: string;
}

@Injectable()
export class RecommendedRoutineUtils {
  public static getHowToProveByCategory(
    category: Category,
  ): HowToProveYouDidIt {
    switch (category) {
      case Category.Health: {
        return {
          script: healthScript,
          imageUrl: `${process.env.AWS_CLOUDFRONT_URL}/origin/how-to-prove/health`,
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
          imageUrl: `${process.env.AWS_CLOUDFRONT_URL}/origin/how-to-prove/reading`,
        };
      }
      case Category.Motivation: {
        return {
          script: motivationScript,
          imageUrl: null,
        };
      }
      default:
        throw new Error('HowToProve의 다른 추천루틴 case 구현하지 않음');
    }
  }
}
