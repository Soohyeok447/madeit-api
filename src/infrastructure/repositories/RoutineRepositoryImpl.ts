import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoutineModel } from '../../domain/models/RoutineModel';
import { RoutineRepository } from '../../domain/repositories/routine/RoutineRepository';
import { UpdateRoutineDto } from '../../domain/repositories/routine/dtos/UpdateRoutineDto';
import { CreateRoutineDto } from '../../domain/repositories/routine/dtos/CreateRoutineDto';

@Injectable()
export class RoutineRepositoryImpl implements RoutineRepository {
  constructor(
    @InjectModel('Routine')
    private readonly routineModel: Model<RoutineModel>,
  ) {}

  public async create(data: CreateRoutineDto): Promise<RoutineModel> {
    const newRoutine = new this.routineModel(data);

    const result = await newRoutine.save();

    return result['_doc'];
  }

  public async update(
    id: string,
    data: UpdateRoutineDto,
  ): Promise<RoutineModel> {
    const result = await this.routineModel
      .findByIdAndUpdate(
        id,
        {
          ...data,
        },
        { runValidators: true, new: true },
      )
      .lean();

    return result;
  }

  public async delete(id: string): Promise<void> {
    await this.routineModel.findByIdAndDelete(id);
  }

  public async findAll(size: number, next?: string): Promise<RoutineModel[]> {
    let result: RoutineModel[];

    if (next) {
      result = await this.routineModel
        .find({
          _id: { $lt: next },
        })
        .sort({
          _id: -1,
        })
        .limit(size)
        .lean();
    } else {
      result = await this.routineModel
        .find()
        .sort({
          _id: -1,
        })
        .limit(size)
        .lean();
    }

    if (!result) {
      return [];
    }

    return result;
  }

  public async findAllByUserId(userId: string): Promise<RoutineModel[]> {
    const result = await this.routineModel
      .find({ user_id: userId })
      .sort({ hour: 1, minute: 1 })
      .lean();

    if (!result) {
      return [];
    }

    return result;
  }

  public async findOne(id: string): Promise<RoutineModel | null> {
    const result = await this.routineModel.findById(id).lean();

    if (!result) {
      return null;
    }

    return result;
  }
}
