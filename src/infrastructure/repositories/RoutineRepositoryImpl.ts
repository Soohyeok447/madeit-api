import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoutineRepository } from '../../domain/repositories/routine/RoutineRepository';
import { UpdateRoutineDto } from '../../domain/repositories/routine/dtos/UpdateRoutineDto';
import { CreateRoutineDto } from '../../domain/repositories/routine/dtos/CreateRoutineDto';
import { RoutineSchemaModel } from '../schemas/models/RoutineSchemaModel';
import { Routine } from '../../domain/entities/Routine';
import { RoutineMapper } from './mappers/RoutineMapper';
import * as moment from 'moment';
moment.locale('ko');

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
          updated_at: moment().format(),
          ...mappedDto,
        },
        { runValidators: true, new: true },
      )
      .exists('deleted_at', false)
      .lean();

    return RoutineMapper.mapSchemaToEntity(routineSchemaModel);
  }

  public async delete(id: string): Promise<void> {
    await this.routineMongoModel.findByIdAndUpdate(id, {
      deleted_at: moment().format(),
    });
  }

  public async findAllByUserId(userId: string): Promise<Routine[]> {
    const routineSchemaModels: RoutineSchemaModel[] =
      await this.routineMongoModel
        .find({ user_id: userId })
        .sort({ hour: 1, minute: 1 })
        .exists('deleted_at', false)
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
      .exists('deleted_at', false)
      .lean();

    if (!routineSchemaModel) {
      return null;
    }

    return RoutineMapper.mapSchemaToEntity(routineSchemaModel);
  }
}
