import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompleteRoutine } from '../../domain/entities/CompleteRoutine';
import { CompleteRoutineRepository } from '../../domain/repositories/complete-routine/CompleteRoutineRepository';
import { CompleteRoutineSchemaModel } from '../schemas/models/CompleteRoutineSchemaModel';
import { CompleteRoutineMapper } from './mappers/CompleteRoutineMapper';

@Injectable()
export class CompleteRoutineRepositoryImpl
  implements CompleteRoutineRepository
{
  public constructor(
    @InjectModel('Complete-Routine')
    private readonly completeRoutineModel: Model<CompleteRoutineSchemaModel>,
  ) {}

  public async findAll(): Promise<CompleteRoutine[]> {
    const documents: CompleteRoutineSchemaModel[] =
      await this.completeRoutineModel.find().lean();

    if (!documents.length) return [];

    const mappedDocuments: CompleteRoutine[] = documents.map((e) => {
      return CompleteRoutineMapper.mapSchemaToEntity(e);
    });

    return mappedDocuments;
  }

  public async findAllByUserId(userId: string): Promise<CompleteRoutine[]> {
    const documents: CompleteRoutineSchemaModel[] =
      await this.completeRoutineModel.find({ id: userId }).lean();

    if (!documents.length) return [];

    const mappedDocuments: CompleteRoutine[] = documents.map((e) => {
      return CompleteRoutineMapper.mapSchemaToEntity(e);
    });

    return mappedDocuments;
  }

  public async save(dto: {
    userId: string;
    routineId: string;
  }): Promise<CompleteRoutine> {
    const mappedDto: {
      user_id: string;
      routine_id: string;
    } = CompleteRoutineMapper.mapCreateDtoToSchema(dto);

    const newModel: any = await this.completeRoutineModel.create(mappedDto);

    const newSchemaModel: any = await newModel.save();

    return CompleteRoutineMapper.mapSchemaToEntity(newSchemaModel);
  }
}
