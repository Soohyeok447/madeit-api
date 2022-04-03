import { AddRoutineResponseDto } from './add-routine/dtos/AddRoutineResponseDto';
import { GetRoutinesResponseDto } from './get-routines/dtos/GetRoutinesResponseDto';
import { GetRoutineResponseDto } from './get-routine/dtos/GetRoutineResponseDto';
import { ModifyRoutineResponseDto } from './modify-routine/dtos/ModifyRoutineResponseDto';
import { ActivateRoutineResponseDto } from './activate-routine/dtos/ActivateRoutineResponseDto';
import { InactivateRoutineResponseDto } from './inactivate-routine/dtos/InactivateRoutineUseCaseResponseDto';

export type AddRoutineResponse = Promise<AddRoutineResponseDto>;

export type GetRoutineResponse = Promise<GetRoutineResponseDto>;

export type ModifyRoutineResponse = Promise<ModifyRoutineResponseDto>;

export type GetRoutinesResponse = Promise<GetRoutinesResponseDto[]>;

export type ToggleActivationResponse = Promise<Record<string, never>>;

export type ActivateRoutineResponse = Promise<ActivateRoutineResponseDto>;

export type InactivateRoutineResponse = Promise<InactivateRoutineResponseDto>;

export type DeleteRoutineResponse = Promise<Record<string, never>>;

export type DoneRoutineResponse = Promise<Record<string, never>>;
