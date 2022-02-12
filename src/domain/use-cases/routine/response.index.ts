import { AddRoutineResponseDto } from './add-routine/dtos/AddRoutineResponseDto';
import { GetAllRoutinesByCategoryResponseDto } from './get-all-routines-by-category/dtos/GetAllRoutinesByCategoryResponseDto';
import { GetAllRoutinesResponseDto } from './get-all-routines/dtos/GetAllRoutinesResponseDto';
import { GetRoutineDetailResponseDto } from './get-routine-detail/dtos/GetRoutineDetailResponseDto';
import { ModifyRoutineResponseDto } from './modify-routine/dtos/ModifyRoutineResponseDto';
import { PatchCardnewsResponseDto } from './patch-cardnews/dtos/PatchCardnewsResponseDto';
import { PatchThumbnailResponseDto } from './patch-thumbnail/dtos/PatchThumbnailResponseDto';

export type AddRoutineResponse = Promise<AddRoutineResponseDto>;
export type GetRoutineDetailResponse = Promise<GetRoutineDetailResponseDto>;
export type ModifyRoutineResponse = Promise<ModifyRoutineResponseDto>;
export type GetAllRoutinesByCategoryResponse =
  Promise<GetAllRoutinesByCategoryResponseDto>;
export type GetAllRoutinesResponse = Promise<GetAllRoutinesResponseDto>;
export type BuyRoutineResponse = Promise<void>;

export type PatchThumbnailResponse = Promise<PatchThumbnailResponseDto>;
export type PatchCardnewsResponse = Promise<PatchCardnewsResponseDto>;
