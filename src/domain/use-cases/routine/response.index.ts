import { GetRoutinesResponseDto } from './get-routines/dtos/GetRoutinesResponseDto';
import { GetRoutineResponseDto } from './get-routine/dtos/GetRoutineResponseDto';
import { ActivateRoutineResponseDto } from './activate-routine/dtos/ActivateRoutineResponseDto';
import { InactivateRoutineResponseDto } from './inactivate-routine/dtos/InactivateRoutineUseCaseResponseDto';

export type GetRoutineResponse = Promise<GetRoutineResponseDto>;

export type GetRoutinesResponse = Promise<GetRoutinesResponseDto[]>;

export type ToggleActivationResponse = Promise<Record<string, never>>;

export type ActivateRoutineResponse = Promise<ActivateRoutineResponseDto>;

export type InactivateRoutineResponse = Promise<InactivateRoutineResponseDto>;

export type DoneRoutineResponse = Promise<Record<string, never>>;
