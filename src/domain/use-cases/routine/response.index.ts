import { AddRoutineResponseDto } from './add-routine/dtos/AddRoutineResponseDto';
import { GetRoutinesResponseDto } from './get-routines/dtos/GetRoutinesResponseDto';
import { GetRoutineResponseDto } from './get-routine/dtos/GetRoutineResponseDto';
import { ModifyRoutineResponseDto } from './modify-routine/dtos/ModifyRoutineResponseDto';

export type AddRoutineResponse = Promise<AddRoutineResponseDto>;

export type GetRoutineResponse = Promise<GetRoutineResponseDto>;

export type ModifyRoutineResponse = Promise<ModifyRoutineResponseDto>;

export type GetRoutinesResponse = Promise<GetRoutinesResponseDto[] | []>;

export type ToggleActivationResponse = Promise<void>

export type DeleteRoutineResponse = Promise<void>

