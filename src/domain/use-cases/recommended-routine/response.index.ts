import { AddRecommendedRoutineResponseDto } from "./add-recommended-routine/dtos/AddRecommendedRoutineResponseDto";
import { ModifyRecommendedRoutineResponseDto } from "./modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto";

export type AddRecommendedRoutineResponse = Promise<AddRecommendedRoutineResponseDto>;

// export type GetRoutineResponse = Promise<GetRoutineResponseDto>;

export type ModifyRecommendedRoutineResponse = Promise<ModifyRecommendedRoutineResponseDto>;

// export type GetRoutinesResponse = Promise<GetRoutinesResponseDto[] | []>;

