/* eslint-disable @typescript-eslint/no-unused-vars */
import { AddRoutineResponseDto } from './add-routine/dtos/AddRoutineResponseDto';
import { GetRoutinesResponseDto } from './get-routines/dtos/GetRoutinesResponseDto';
import { GetRoutineResponseDto } from './get-routine/dtos/GetRoutineResponseDto';
import { ModifyRoutineResponseDto } from './modify-routine/dtos/ModifyRoutineResponseDto';
import { ActivateRoutineResponseDto } from './activate-routine/dtos/ActivateRoutineResponseDto';
import { InactivateRoutineResponseDto } from './inactivate-routine/dtos/InactivateRoutineUseCaseResponseDto';
import { CommonRoutineResponseDto } from './common/CommonRoutineResponseDto';

export type AddRoutineResponse = Promise<CommonRoutineResponseDto>;

export type GetRoutineResponse = Promise<CommonRoutineResponseDto>;

export type ModifyRoutineResponse = Promise<CommonRoutineResponseDto>;

export type GetRoutinesResponse = Promise<CommonRoutineResponseDto[]>;

export type ToggleActivationResponse = Promise<Record<string, never>>;

export type ActivateRoutineResponse = Promise<CommonRoutineResponseDto>;

export type InactivateRoutineResponse = Promise<CommonRoutineResponseDto>;

export type DeleteRoutineResponse = Promise<Record<string, never>>;

export type DoneRoutineResponse = Promise<Record<string, never>>;
