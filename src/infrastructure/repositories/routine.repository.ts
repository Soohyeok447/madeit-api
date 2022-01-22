import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Routine } from 'src/domain/common/models/routine.model';
import { RoutineRepository } from 'src/domain/common/repositories/routine/routine.repsotiroy';
import { CreateRoutineDto } from 'src/domain/common/repositories/routine/dtos/create.dto';
import { UpdateRoutineDto } from 'src/domain/common/repositories/routine/dtos/update.dto';

@Injectable()
export class RoutineRepositoryImpl implements RoutineRepository {
  constructor(
    @InjectModel('Routine')
    private readonly routineModel: Model<Routine>,
  ) {}

  public async create(data: CreateRoutineDto): Promise<Routine> {
    const newRoutine = new this.routineModel(data);

    const result = await newRoutine.save();

    return result;
  }

  public async update(id: string, data: UpdateRoutineDto): Promise<Routine> {
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

  public async findAll(size:number, next?: string): Promise<Routine[]> {
    let result: Routine[];

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

  public async findAllByCategory(category:number, size:number, next?: string): Promise<Routine[]> {
    let result: Routine[];

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

  public async findOne(id: string): Promise<Routine> {
    const result = await this.routineModel.findById(id)
    .populate('cardnews_id')
    .populate('thumbnail_id')
    .lean();

    if (!result) {
      return undefined;
    }

    return result;
  }

  public async findOneByRoutineName(name: string): Promise<Routine> {
    const result = await this.routineModel.findOne({ name }).lean();

    if (!result) {
      return undefined;
    }

    return result;
  }
}
