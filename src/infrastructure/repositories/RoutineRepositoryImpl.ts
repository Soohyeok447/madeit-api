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

    return result;
  }

  public async update(id: string, data: UpdateRoutineDto): Promise<RoutineModel> {
    const result = await this.routineModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { runValidators: true, new: true },
    );

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
        .populate('thumbnail_id')
        .lean();
    } else {
      result = await this.routineModel
        .find()
        .sort({
          _id: -1,
        })
        .limit(size)
        .populate('thumbnail_id')
        .lean();
    }

    return result;
  }

  public async findAllByCategory(
    category: number,
    size: number,
    next?: string,
  ): Promise<RoutineModel[]> {
    let result: RoutineModel[];

    if (next) {
      result = await this.routineModel
        .find({
          _id: { $lt: next },
        })
        .where('category')
        .equals(category)
        .sort({
          _id: -1,
        })
        .limit(size)
        .populate('thumbnail_id')
        .lean();
    } else {
      result = await this.routineModel
        .find()
        .where('category')
        .equals(category)
        .sort({
          _id: -1,
        })
        .limit(size)
        .populate('thumbnail_id')
        .lean();
    }

    return result;
  }

  public async findOne(id: string): Promise<RoutineModel> {
    const result = await this.routineModel
      .findById(id)
      .populate('cardnews_id')
      .populate('thumbnail_id')
      .lean();

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async findOneByRoutineName(name: string): Promise<RoutineModel> {
    const result = await this.routineModel.findOne({ name }).lean();

    if (!result) {
      return undefined;
    }

    return result;
  }
}
