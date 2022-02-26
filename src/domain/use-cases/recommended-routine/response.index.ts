import { AddRecommendedRoutineResponseDto } from "./add-recommended-routine/dtos/AddRecommendedRoutineResponseDto";
import { ModifyRecommendedRoutineResponseDto } from "./modify-recommended-routine/dtos/ModifyRecommendedRoutineResponseDto";

export type AddRecommendedRoutineResponse = Promise<AddRecommendedRoutineResponseDto>;

export type ModifyRecommendedRoutineResponse = Promise<ModifyRecommendedRoutineResponseDto>;

export type DeleteRecommendedRoutineResponse = Promise<void>;

// export type GetRoutineResponse = Promise<GetRoutineResponseDto>;

// export type GetRoutinesResponse = Promise<GetRoutinesResponseDto[] | []>;
