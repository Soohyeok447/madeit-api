import { AddRecommendedRoutineResponseDto } from './add-recommended-routine/dtos/AddRecommendedRoutineResponseDto';
import { GetRecommendedRoutineResponseDto } from './get-recommended-routine/dtos/GetRecommendedRoutineResponseDto';
import { GetRecommendedRoutinesByCategoryResponseDto } from './get-recommended-routines-by-category/dtos/GetRecommendedRoutinesByCategoryResponseDto';
import { ModifyRecommendedRoutineResponseDto } from './modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto';

export type AddRecommendedRoutineResponse =
  Promise<AddRecommendedRoutineResponseDto>;

export type ModifyRecommendedRoutineResponse =
  Promise<ModifyRecommendedRoutineResponseDto>;

export type DeleteRecommendedRoutineResponse = Promise<Record<string, never>>;

export type GetRecommendedRoutineResponse =
  Promise<GetRecommendedRoutineResponseDto>;

export type GetRecommendedRoutinesByCategoryResponse =
  Promise<GetRecommendedRoutinesByCategoryResponseDto>;

export type PatchCardnewsResponse = Promise<Record<string, never>>;

export type PatchThumbnailResponse = Promise<Record<string, never>>;
