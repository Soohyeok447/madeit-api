import { AddRecommendedRoutineResponseDto } from './add-recommended-routine/dtos/AddRecommendedRoutineResponseDto';
import { GetRecommendedRoutineResponseDto } from './get-recommended-routine/dtos/GetRecommendedRoutineResponseDto';
import { GetRecommendedRoutinesResponseDto } from './get-recommended-routines/dtos/GetRecommendedRoutinesResponseDto';
import { ModifyRecommendedRoutineResponseDto } from './modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto';

export type AddRecommendedRoutineResponse =
  Promise<AddRecommendedRoutineResponseDto>;

export type ModifyRecommendedRoutineResponse =
  Promise<ModifyRecommendedRoutineResponseDto>;

export type DeleteRecommendedRoutineResponse = Promise<Record<string, never>>;

export type GetRecommendedRoutineResponse =
  Promise<GetRecommendedRoutineResponseDto>;

export type GetRecommendedRoutinesResponse =
  Promise<GetRecommendedRoutinesResponseDto>;

export type PatchCardnewsResponse = Promise<Record<string, never>>;

export type PatchThumbnailResponse = Promise<Record<string, never>>;
