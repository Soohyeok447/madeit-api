import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoutineRepository } from '../../domain/repositories/routine/RoutineRepository';
import { UpdateRoutineDto } from '../../domain/repositories/routine/dtos/UpdateRoutineDto';
import { CreateRoutineDto } from '../../domain/repositories/routine/dtos/CreateRoutineDto';
import { RoutineSchemaModel } from '../schemas/models/RoutineSchemaModel';
import { Routine } from '../../domain/entities/Routine';
import { RoutineMapper } from './mappers/RoutineMapper';

@Injectable()
export class RoutineRepositoryImpl implements RoutineRepository {
  public constructor(
    @InjectModel('Routine')
    private readonly routineMongoModel: Model<RoutineSchemaModel>,
  ) {}

  public async create(dto: CreateRoutineDto): Promise<Routine> {
    const mappedDto: RoutineSchemaModel =
      RoutineMapper.mapCreateDtoToSchema(dto);

    const newRoutine: any = new this.routineMongoModel(mappedDto);

    const routineSchemaModel: any = await newRoutine.save();

    return RoutineMapper.mapSchemaToEntity(routineSchemaModel);
  }

  public async update(id: string, dto: UpdateRoutineDto): Promise<Routine> {
    const mappedDto: RoutineSchemaModel =
      RoutineMapper.mapUpdateDtoToSchema(dto);

    const routineSchemaModel: RoutineSchemaModel = await this.routineMongoModel
      .findByIdAndUpdate(
        id,
        {
          ...mappedDto,
        },
        { runValidators: true, new: true },
      )
      .lean();

    return RoutineMapper.mapSchemaToEntity(routineSchemaModel);
  }

  public async delete(id: string): Promise<void> {
    await this.routineMongoModel.findByIdAndDelete(id);
  }

  public async findAllByUserId(userId: string): Promise<Routine[]> {
    const routineSchemaModels: RoutineSchemaModel[] =
      await this.routineMongoModel
        .find({ user_id: userId })
        .sort({ hour: 1, minute: 1 })
        .lean();

    if (!routineSchemaModels) {
      return [];
    }

    const routineEntities: Routine[] = routineSchemaModels.map(
      (routineSchemaModel) => {
        return RoutineMapper.mapSchemaToEntity(routineSchemaModel);
      },
    );

    return routineEntities;
  }

  public async findOne(id: string): Promise<Routine | null> {
    const routineSchemaModel: RoutineSchemaModel = await this.routineMongoModel
      .findById(id)
      .lean();

    if (!routineSchemaModel) {
      return null;
    }

    return RoutineMapper.mapSchemaToEntity(routineSchemaModel);
  }
}
